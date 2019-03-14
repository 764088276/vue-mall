const filters = {
  getEvenList(data) {
    const _data = data.filter((item, index) => {
      if (index % 2) {
        return item
      }
    });
    return _data
  }
};
export default filters
