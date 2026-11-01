#!/usr/bin/env node
/**
 * Import a folder of GPS-tagged photos (e.g. exported from an iPhone) into a
 * route's manifest.json entry, grouping nearby photos into a single pin with
 * a carousel. See .claude/skills (or the project README) for the workflow
 * this is meant to be run from.
 *
 * Usage:
 *   node scripts/import-photos.cjs <routeId> <sourceDir> [--captions=path.json] [--group-distance=50]
 *
 * <sourceDir> should contain the source photos (HEIC or JPEG - both work).
 * --captions points at a JSON file of { "filename.heic": "caption text" }
 * (filenames without captions are imported with caption: null).
 * --group-distance is the proximity threshold in meters for bundling nearby
 * photos into one pin (default 50).
 *
 * Re-running for the same routeId replaces that route's entire `photos`
 * array rather than appending to it.
 */
const fs = require('fs');
const path = require('path');
const exifr = require('exifr');
const sharp = require('sharp');

const MANIFEST_PATH = path.join(__dirname, '..', 'public', 'gpx', 'manifest.json');
const PHOTO_EXTENSIONS = new Set(['.heic', '.heif', '.jpg', '.jpeg', '.png']);
const THUMBNAIL_WIDTH = 400;
const FULL_WIDTH = 1600;

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      flags[key] = value ?? true;
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function haversineMeters(aLat, aLon, bLat, bLon) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findRoute(manifest, routeId) {
  for (const group of manifest.groups) {
    for (const route of group.routes ?? []) {
      if (route.id === routeId) return route;
    }
    for (const collection of group.collections) {
      for (const route of collection.routes) {
        if (route.id === routeId) return route;
      }
    }
  }
  return null;
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [routeId, sourceDir] = positional;

  if (!routeId || !sourceDir) {
    console.error('Usage: node scripts/import-photos.cjs <routeId> <sourceDir> [--captions=path.json] [--group-distance=50]');
    process.exit(1);
  }

  const groupDistanceMeters = flags['group-distance'] ? Number(flags['group-distance']) : 50;
  const captions = flags.captions
    ? JSON.parse(fs.readFileSync(flags.captions, 'utf8'))
    : {};

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const route = findRoute(manifest, routeId);
  if (!route) {
    console.error(`No route with id "${routeId}" found in manifest.json`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => PHOTO_EXTENSIONS.has(path.extname(f).toLowerCase()));

  if (files.length === 0) {
    console.error(`No photos found in ${sourceDir}`);
    process.exit(1);
  }

  // 1. Read GPS + timestamp from each photo, skipping any with no GPS data.
  const photosRaw = [];
  for (const filename of files) {
    const filePath = path.join(sourceDir, filename);
    // Read into a Buffer rather than handing exifr the path directly - its
    // internal chunked file reader hits a Node fs.promises.FileHandle.stat()
    // signature mismatch on newer Node versions when given a path string.
    const fileBuffer = fs.readFileSync(filePath);
    const exif = await exifr.parse(fileBuffer, { gps: true, pick: ['DateTimeOriginal', 'CreateDate'] });
    if (!exif || exif.latitude === undefined || exif.longitude === undefined) {
      console.warn(`  skipping ${filename} - no GPS data found`);
      continue;
    }
    const takenAt = exif.DateTimeOriginal || exif.CreateDate || null;
    photosRaw.push({
      filename,
      filePath,
      lat: exif.latitude,
      lon: exif.longitude,
      takenAt: takenAt ? new Date(takenAt).toISOString() : null,
      caption: captions[filename] ?? null,
    });
  }

  if (photosRaw.length === 0) {
    console.error('No photos with GPS data to import.');
    process.exit(1);
  }

  // 2. Sort chronologically (undated photos sort last, keeping file order among themselves).
  photosRaw.sort((a, b) => {
    if (a.takenAt && b.takenAt) return a.takenAt.localeCompare(b.takenAt);
    if (a.takenAt) return -1;
    if (b.takenAt) return 1;
    return 0;
  });

  // 3. Group by proximity to the first photo added to each group.
  const groups = [];
  for (const photo of photosRaw) {
    const nearGroup = groups.find(
      (g) => haversineMeters(g.lat, g.lon, photo.lat, photo.lon) <= groupDistanceMeters,
    );
    if (nearGroup) {
      nearGroup.rawPhotos.push(photo);
    } else {
      groups.push({ lat: photo.lat, lon: photo.lon, rawPhotos: [photo] });
    }
  }

  // 4. Convert + resize each photo, write into public/photos/<routeId>/<groupId>/, build manifest entries.
  const outDirBase = path.join(__dirname, '..', 'public', 'photos', routeId);
  const manifestGroups = [];
  for (let gi = 0; gi < groups.length; gi++) {
    const group = groups[gi];
    const groupId = `group-${gi + 1}`;
    const outDir = path.join(outDirBase, groupId);
    fs.mkdirSync(outDir, { recursive: true });

    const photoRefs = [];
    for (const photo of group.rawPhotos) {
      const id = slugify(photo.filename) || `photo-${photoRefs.length + 1}`;
      const thumbName = `${id}-thumb.jpg`;
      const fullName = `${id}-full.jpg`;

      await sharp(photo.filePath)
        .rotate() // apply EXIF orientation before resizing
        .resize({ width: THUMBNAIL_WIDTH })
        .jpeg({ quality: 75 })
        .toFile(path.join(outDir, thumbName));

      await sharp(photo.filePath)
        .rotate()
        .resize({ width: FULL_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toFile(path.join(outDir, fullName));

      photoRefs.push({
        id,
        takenAt: photo.takenAt,
        caption: photo.caption,
        thumbnail: `photos/${routeId}/${groupId}/${thumbName}`,
        full: `photos/${routeId}/${groupId}/${fullName}`,
      });
    }

    // Representative point for the pin: average of this group's photos.
    const avgLat = group.rawPhotos.reduce((s, p) => s + p.lat, 0) / group.rawPhotos.length;
    const avgLon = group.rawPhotos.reduce((s, p) => s + p.lon, 0) / group.rawPhotos.length;

    manifestGroups.push({ id: groupId, lat: avgLat, lon: avgLon, photos: photoRefs });
  }

  // 5. Replace this route's photos array and write manifest.json back out (no BOM).
  route.photos = manifestGroups;
  const json = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(MANIFEST_PATH, json, { encoding: 'utf8' });

  const totalPhotos = manifestGroups.reduce((s, g) => s + g.photos.length, 0);
  console.log(
    `Imported ${totalPhotos} photo(s) into ${manifestGroups.length} group(s) for route "${routeId}".`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
