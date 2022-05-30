import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import FlipMove from 'react-flip-move';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import {useState} from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import {renderIcon, renderLabel, renderErrors} from "./imageuploader/imageuploader"


const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%"
};


const cardStyle = {
  height: "180px",
  width: "40vw",
  maxWidth: "400px",
  overflow: "hidden",
  margin: "10px 0",
}

const actionStyle = {
  maxWidth: "400px",
  height: "100%"
}

const ERROR = {
  NOT_SUPPORTED_EXTENSION: 'NOT_SUPPORTED_EXTENSION',
  FILESIZE_TOO_LARGE: 'FILESIZE_TOO_LARGE'
}


class ReactImageUploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [...props.defaultImages],
      files: [],
      fileErrors: [], 
      ingredients: [],
      recipies: [],
      loading : false,
      search: [],
    };
    this.inputElement = '';
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
    this.recognize = this.recognize.bind(this);
    this.getRecipies = this.getRecipies.bind(this);

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.files !== this.state.files){
      this.props.onChange(this.state.files, this.state.pictures);
    }
    
  }


  /*
   Load image at the beggining if defaultImage prop exists
   */
  componentWillReceiveProps(nextProps){
    if(nextProps.defaultImages !== this.props.defaultImages){
      this.setState({pictures: nextProps.defaultImages});
    }
  }

  /*
	 Check file extension (onDropFile)
	 */
  hasExtension(fileName) {
    const pattern = '(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
  }

  /*
   Handle file validation
   */
  onDropFile(e) {
    const files = e.target.files;
    const allFilePromises = [];
    const fileErrors = [];

  
    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileError = {
        name: file.name,
      };
      // Check for file extension
      if (!this.hasExtension(file.name)) {
        fileError = Object.assign(fileError, {
          type: ERROR.NOT_SUPPORTED_EXTENSION
        });
        fileErrors.push(fileError);
        continue;
      }
      // Check for file size
      if(file.size > this.props.maxFileSize) {
        fileError = Object.assign(fileError, {
          type: ERROR.FILESIZE_TOO_LARGE
        });
        fileErrors.push(fileError);
        continue;
      }

      allFilePromises.push(this.readFile(file));
    }

    this.setState({
      fileErrors
    });

    const {singleImage} = this.props;

    Promise.all(allFilePromises).then(newFilesData => {
      const dataURLs = singleImage?[]:this.state.pictures.slice();
      const files = singleImage?[]:this.state.files.slice();

      newFilesData.forEach(newFileData => {
        dataURLs.push(newFileData.dataURL);
        files.push(newFileData.file);
      });
      
      this.setState({pictures: dataURLs, files: files});
    });
  }

  onUploadClick(e) {
    // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
    e.target.value = null;
  }

  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result;
        // dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
    
        resolve({file, dataURL});
      };

      reader.readAsDataURL(file);
    });
  }

  ingredients_map = {
    "甜椒": "pepper",
    "西红柿": 'tomato',
    "番茄": 'tomato',
    "胡萝卜": 'carrot',
    "红萝卜": 'carrot',
    "苹果": 'apple',
    "柑橘": 'orange',
    "橙子": 'orange',
    "马铃薯": 'potato',
    "土豆": 'potato'
  };


  recognize() {
      let dataURLs = this.state.pictures;
      if(dataURLs != 0){
      console.log("dataURLs: ", dataURLs[0]);
      this.setState({loading: true});
      let dataURL = dataURLs[0];
      dataURL = dataURL.substr(23, dataURL.length - 2);
      dataURL = encodeURI(dataURL)
      let ingredients = [];
      this.fetchData(dataURL).then(res => {
          console.log("res: ", res);
          res.result.forEach(ele => {
            console.log("ele: ", ele);
            if (ele.score > 0) {
              if (ele.name != '非果蔬食材') {
                let ingredient_en = this.ingredients_map[ele.name];
                if (ingredient_en != null && !ingredients.includes(ingredient_en)) {
                   ingredients.push(ingredient_en);
                }
              }
            }
          });
          
          console.log("ingredients: ", ingredients);
          if(ingredients.length>0){
            this.setState({
              ingredients: ingredients
            });
          }
          else{
            this.setState({
              ingredients: ["Dont know"]
            });
          }
          this.setState({loading: false});         
      });
    }
  }

  getRecipies() {
    // let ingredients = this.state.ingredients;
    let input = document.getElementById("input_text").value;
    var t1 = input.replace(/[\r\n]/g, ""); // to remove the line-break
    var t2 = t1. replace(/[\!|\.|\?|\:|\"|\[|\]|\{|\}|\(|\)]/g, ""); // and to remove some special marks
    let ingredients =t2.split(" ");
    this.setState({search: ingredients})
    for (var i in input.length){
      ingredients[i] = input[i]
    }
    console.log("ingredients: ", ingredients);
    let options = {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({"ingredients": ingredients})
    };

    let recipies = [];
    return fetch("http://localhost:8081/search", options).then(res => res.json())
    .then(res => {
      console.log("res", res);
      console.log(res.hits);
      let num = Math.min(5, res.hits);
      res.search.forEach(hit => {
          if (num > 0) {
            recipies.push(hit);
          }
          num --;
      });
      console.log("recipies: ", recipies);
      this.setState(
        {recipies: recipies}
      );
    });
  }

  fetchData(imageBase64) {
    imageBase64 = encodeURIComponent(imageBase64);
    console.log("typeImageBase64: ", imageBase64);
    let requestOptions = {
      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: "image="+imageBase64
    };
    return fetch("http://localhost:5000/objects", requestOptions)
    .then(res => res.json())
    .then((responseJson) => {
      return responseJson;
    }).catch((error) => {
      console.log("error", error);
    })
  }

  /*
   Remove the image from state
   */
  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex(e => e === picture);
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
    const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);

    this.setState({pictures: filteredPictures, files: filteredFiles}, () => {
      this.props.onChange(this.state.files, this.state.pictures);
    });
  }

  /*
   Render preview images
   */
  renderPreview() {
    return (
      <div className="uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    );
  }

  renderPreviewPictures() {
    return this.state.pictures.map((picture, index) => {
      return (
        <div key={index} className="uploadPictureContainer">
          <div className="deleteImage" onClick={() => this.removeImage(picture)}>X</div>
          <img src={picture} className="uploadPicture" alt="preview"/>

        </div>
      );
    });
  }

  // render ingredients
  renderIngredients() {
    return this.state.ingredients.map((ingredient, index) => {
      return (
        <div key={index} className="">
          <div className=""><p>{ingredient}</p></div>
        </div>
      );
    });
  }


 // render recipies
  renderRecipies() {
    return this.state.recipies.map((item, index) => {
      console.log("item: ", item);
      console.log("index: ", index);
      let ingredientItems = item.ingredients.map((ingredient) =>
          <span>{ingredient} </span>
      );

      let instructionItems = item.instructions.map((line) =>
          <span>{line} </span>
      );
      return (
        <React.Fragment key={item.id}>
                         
          <Card style = {cardStyle}>
          <CardActionArea style = {actionStyle} href = {item.url}>
           <CardContent>
           <Typography gutterBottom variant="h6" component="div">
             {item.name}
           </Typography>
           <br/>
            <Box sx={{display: 'flex', flexDirection: 'column' }}>
            <Typography    text-overflow = "ellipsis" align = "left" variant="body2" color="text.secondary">
              <strong>Ingredients:</strong> {ingredientItems}
              </Typography> 
              { /*
            <Typography  text-overflow = "ellipsis" align = "left" variant="body2" color="text.secondary">
              <strong>Instructions:</strong> {instructionItems}
            </Typography>
            */
             }
            </Box>
            </CardContent>
            </CardActionArea>
          </Card>
         
        </React.Fragment>
      );
    });
  }

  /*
   On button click, trigger input file to open
   */
  triggerFileUpload() {
    console.log("this.inputElement: ", this.inputElement);
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({pictures: []})
  }

  


  render() {
    return (
     
      <div className={"fileUploader " + this.props.className} style={this.props.style}>
         <div className = "left">
         <img  src="FR_logo.png" className='logo-image'/>
        <div className = "search_bar">
        <TextField className='input-text'
          id="input_text"
          InputLabelProps={{
            style: { color: '#C4C4C4' },
          }}
          multiline
          rows={1}
          padding
          inputProps = {{style: {fontSize: 18}}}
          fullWidth 
          margin = "normal"
         />
       <IconButton aria-label="delete" size="small" onClick={this.getRecipies}>
        <SearchIcon className='searchIcon' size = "large" sx={{ color: 'orange' }} />
      </IconButton>
      </div>
      <div className="fileContainer" style={this.props.fileContainerStyle}>
          <renderLabel labelClass = {this.props.labelClass} labelStyles = {this.props.labelStyles} label = {this.props.label} />
          <div className="errorsContainer">
            <renderErrors/>
          </div>
          <Stack className='button-container'spacing={20} direction = "row">
          <Button
            variant="outlined" component="span"
            sx={{ color: '#FFFF', backgroundColor: 'orange', borderColor: 'orange' }}
            className="update"
            onClick={this.triggerFileUpload}
          >
            Update Image
          </Button>
          <input
            type="file"
            ref={input => this.inputElement = input}
            name={this.props.name}
            multiple={!this.props.singleImage}
            onChange={this.onDropFile}
            onClick={this.onUploadClick}
            accept={this.props.accept}
          />
           <Button
             variant="outlined" component="span"
             sx={{ color: '#FFFF', backgroundColor: 'orange', borderColor: 'orange' }}
            className = "recognize"
            onClick={this.recognize}
          >
            Recognize
          </Button>
          </Stack>
          { this.props.withPreview ? this.renderPreview() : null }
        </div>
        { this.state.loading &&
        <div className = "rec_result">
          <CircularProgress />
          </div>
          }   
        {this.state.loading? null : this.renderIngredients()}
        </div>
        
        <div className = "right">
           <p className='recipe-header'>Recipe Results</p>
           <div className = "recipes">
             <div className = "notice">
           {this.state.search.map(key => (
             <span>{key};  </span>
           ))}
           <span>results shown below: </span>
           </div>
           {this.renderRecipies()}
         </div>
         </div>
       </div>
    )
  }
}

ReactImageUploadComponent.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: "",
  buttonStyles: {},
  withPreview: false,
  accept: "image/*",
  name: "",
  withIcon: true,
  buttonText: "Choose images",
  buttonType: "button",
  withLabel: true,
  label: "Max file size: 5mb, accepted: jpg|gif|png",
  labelStyles: {},
  labelClass: "",
  imgExtension: ['.jpg', '.jpeg', '.gif', '.png'],
  maxFileSize: 5242880,
  fileSizeError: " file size is too big",
  fileTypeError: " is not a supported file extension",
  errorClass: "",
  style: {},
  errorStyle: {},
  singleImage: false,
  onChange: () => {},
  defaultImages: []
};

ReactImageUploadComponent.propTypes = {
  style: PropTypes.object,
  fileContainerStyle: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  buttonClassName: PropTypes.string,
  buttonStyles: PropTypes.object,
  buttonType: PropTypes.string,
  withPreview: PropTypes.bool,
  accept: PropTypes.string,
  name: PropTypes.string,
  withIcon: PropTypes.bool,
  buttonText: PropTypes.string,
  withLabel: PropTypes.bool,
  label: PropTypes.string,
  labelStyles: PropTypes.object,
  labelClass: PropTypes.string,
  imgExtension: PropTypes.array,
  maxFileSize: PropTypes.number,
  fileSizeError: PropTypes.string,
  fileTypeError: PropTypes.string,
  errorClass: PropTypes.string,
  errorStyle: PropTypes.object,
  singleImage: PropTypes.bool,
  defaultImages: PropTypes.array
};

export default ReactImageUploadComponent;
