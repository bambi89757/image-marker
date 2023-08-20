// import API from "./index";
import versions from "./versions.json";
import marks from "./marks.json";
import pictures from "./pictures.json";

export function getMarks(id) {
  if (!id) return;
  return Promise.resolve(marks);
}

export function getPictures() {
  return Promise.resolve(pictures);
}

export function getVersions() {
  return Promise.resolve(versions);
}

export function getPictureDetail(id) {
  if (!id) return;
  return Promise.resolve(pictures.find(one => one.id == id) || {});
}
