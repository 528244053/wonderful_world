import React from 'react';
import { Button, Popover } from 'antd';

const SelectWindow = ( { handleSelect,height = 100,imgUrl,desc,imgName = 'null' }) => {
    const width = height * 0.9 / 3 * 2;
    return (
      <div style={{width,height,margin:5,border:'solid 2px',boxSizing:'content-box'}}>
        <Popover placement={'right'} content={desc} visible={desc?null:false}>
         <img src={require('../../assets'+imgUrl)} alt={imgName} width={width-2} height={height * 0.9}/>
        </Popover>
        <div style={{padding:2,height:height*0.08,display:'flex',flexDirection:'column',alignContent:'center'}}>
          <Button onClick={handleSelect}>
            选择
          </Button>
        </div>
      </div>
    )
};

export default SelectWindow;
