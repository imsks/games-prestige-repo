export const setLocalStorageData = ({ url, ql }) => {
  localStorage.setItem("url", url);
  localStorage.setItem("ql", ql);
};

export const nullifyLocalStorageData = () => {
  localStorage.clear();
};
