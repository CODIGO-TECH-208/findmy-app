import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'db.json');

async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function genId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getCollection(name) {
  const db = await readDB();
  if (!db[name]) db[name] = [];
  return db[name];
}

async function list(name) {
  return await getCollection(name);
}

async function get(name, id) {
  const col = await getCollection(name);
  return col.find((item) => String(item.id) === String(id)) || null;
}

async function create(name, obj) {
  const db = await readDB();
  db[name] = db[name] || [];
  const item = Object.assign({}, obj);
  if (!item.id) item.id = genId(name + '_');
  db[name].push(item);
  await writeDB(db);
  return item;
}

async function update(name, id, patch) {
  const db = await readDB();
  db[name] = db[name] || [];
  const idx = db[name].findIndex((i) => String(i.id) === String(id));
  if (idx === -1) return null;
  db[name][idx] = Object.assign({}, db[name][idx], patch);
  await writeDB(db);
  return db[name][idx];
}

async function remove(name, id) {
  const db = await readDB();
  db[name] = db[name] || [];
  const idx = db[name].findIndex((i) => String(i.id) === String(id));
  if (idx === -1) return false;
  db[name].splice(idx, 1);
  await writeDB(db);
  return true;
}

export { readDB, writeDB, list, get, create, update, remove };
