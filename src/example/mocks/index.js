// import API from "./index";
import versions from "./versions.json";
import marks from "./marks.json";
import drafts from "./drafts.json";

export function getMarks(id) {
  if (!id) return;
  return Promise.resolve(marks);
}

export function getDrafts(id) {
//   if (!id) return;
  return Promise.resolve(drafts);
}

export function getVersions() {
  return Promise.resolve(versions);
}

export function getDraftDetail(id) {
  if (!id) return;
  return Promise.resolve(drafts.find(one => one.id === id) || {});
}
