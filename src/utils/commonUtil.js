// 获取表格元素距window上边缘的距离
export const getElementToPageTop = el => {
  if (el && el.offsetParent) {
    return getElementToPageTop(el.offsetParent) + el.offsetTop;
  }
  return el?el.offsetTop:0;
};


