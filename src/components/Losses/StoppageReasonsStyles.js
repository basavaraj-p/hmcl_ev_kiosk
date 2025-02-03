// import fonts from "../../style/fonts";
// import colors from "../../style/colors";

// const tableCell = {
//   cellStyle : {
//     color : 'whitesmoke', textAlign : 'center', fontSize : '14px', padding : '9px',
//     fontFamily: fonts.fontStyle7['font-family'],
//     fontStyle: fonts.fontStyle7['font-style'],
//     fontWeight: fonts.fontStyle7['font-weight'],
//     textAlign : 'center',
//     width: "300px" ,
//   }
// }


// const tableRow = {
//   rowStyle : {
//     color : 'white', textAlign : 'center', padding : '9px',
//     fontFamily: fonts.fontStyle7['font-family'],
//     fontStyle: fonts.fontStyle7['font-style'],
//     fontWeight: fonts.fontStyle7['font-weight'],
    
//   }
// }

// const tableRow2= {
//   rowStyle : {
//     color : 'white', textAlign : 'center', padding : '16px',
//     fontFamily: fonts.fontStyle7['font-family'],
//     fontStyle: fonts.fontStyle7['font-style'],
//     fontWeight: fonts.fontStyle7['font-weight'],
//   }
// }

// const tableRowMargin = {
//   margin : {
//     margin : '1rem'
//   }
// }

// export default {tableCell,tableRow,tableRowMargin,tableRow2};


import fonts from "../../style/fonts";
import colors from "../../style/colors";

const tableCell = {
  cellStyle : {
    color : 'whitesmoke', textAlign : 'left', fontSize : '14px', padding : '7px', paddingLeft : "5rem", paddingRight : "-2rem", 
    fontFamily: fonts.fontStyle9['font-family'],
    fontStyle : fonts.fontStyle9['font-style'],
    fontWeight: fonts.fontStyle9['font-weight'],
    textAlign : 'left',
    width: "270px" ,
  }
}

const tableRow = {
  rowStyle : {
    color : 'white', textAlign : 'left', padding : '9px',paddingLeft : "5rem",
    fontFamily: fonts.fontStyle7['font-family'],
    fontStyle: fonts.fontStyle7['font-style'],
    fontWeight: fonts.fontStyle7['font-weight'],
  }
}

const tableRow2= {
  rowStyle : {
    color : 'white', textAlign : 'left', 
    paddingRight : '16px', paddingTop : '16px', 
    paddingBottom : "16px", paddingLeft : "5rem", 
    fontFamily: fonts.fontStyle7['font-family'],
    fontStyle: fonts.fontStyle7['font-style'],
    fontWeight: fonts.fontStyle7['font-weight'],
  }
}


//For Leak testing
const tableCell2 = {
  cellStyle : {
    textAlign : 'left',
    color : 'whitesmoke', fontSize : '16px', padding: '5px',paddingLeft : '-5px',
    marginTop : '10px',
    fontFamily: fonts.fontStyle9['font-family'],
    fontStyle : fonts.fontStyle9['font-style'],
    fontWeight: fonts.fontStyle9['font-weight'],
    // width : '150px'
  }
}

//For Leak testing
const tableRow3 = {
  rowStyle : {
    color : 'white', textAlign : 'left', padding : '6px',
    fontFamily: fonts.fontStyle7['font-family'],
    fontStyle : fonts.fontStyle7['font-style'],
    fontWeight: fonts.fontStyle7['font-weight'],
  }
}


const tableRowMargin = {
  margin : {
    margin : '1rem'
  }
}

export default {tableCell,tableRow,tableRowMargin,tableRow2,tableRow3,tableCell2};