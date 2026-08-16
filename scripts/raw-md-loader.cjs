module.exports = function rawMdLoader(source) {
  return `export default ${JSON.stringify(source)}`;
};
