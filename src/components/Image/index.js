import React from 'react';
import propTypes from 'prop-types';

const assetsUrl = "../../assets";

class Image extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { loading:true };
  }

  render() {
    const { url,title,width,height } = this.props;
    const { loading } = this.state;
    if(!url) {
      return (
        <div style={{width,height,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div>
            {title}(暂无图片)
          </div>
        </div>
      )
    }
    return (
      <div style={{width,height,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img
          hidden={loading}
          alt={title}
          src={require(`../../assets${url}`)}
          width={width}
          height={height}
          onLoad={() => this.setState({ loading:false })}
        />
        {loading && (
          <div>
            {title}(加载中)
          </div>
        )}
      </div>
    )


  }


}

Image.propTypes = {
  url:propTypes.string,
  title:propTypes.string, //标题
  width:propTypes.number, //宽度
  height:propTypes.number, //高度
};

Image.defaultProps = {
  url:undefined,
  title:"默认图片",
  width:200,
  height:300,
};




export default Image;
