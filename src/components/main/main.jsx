import {useState, useRef, Filereader} from "react";
import "./main.css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { uploadDocuments } from "../image-upload/image-uploader";
import {RecipeListItem} from "../reciptitem/reciptitem"

export default function Main(){

    const [displayedImage, setDisplayedImage] = useState([]);

    const Input = styled('input')({
        display: 'none',
      });

      const updateImages = (newImages) => {        
        const images = uploadDocuments(Object.values(newImages.target.files), setDisplayedImage, "prediction");
        console.log(images);
    };


    return (
        <div className = "main">
             <div className = "left">
                  <div className = "logo">
                  <img  src="assets/cook.png" width="350px" height="200px"  />
                  </div>
                  <div className = "search_bar">
                      <div className = "textfield">
                  <TextField
                    id="spellcheck_input"
                    label="Input Text"
                    multiline
                    rows={1}
                    padding
                    inputProps = {{style: {fontSize: 20}}}
                    fullWidth 
                    margin = "normal"
                 />
                      </div>
                 <IconButton aria-label="delete" size="small">
                         <SearchIcon size = "large"  />
                  </IconButton>
                 </div>

                 <div className="otherinput">
                 <Stack spacing={10} direction = "row">
                 <Button variant="outlined" component="span" > Voice</Button>
                 <label htmlFor="contained-button-file">
                 <Input accept="image/*" id="contained-button-file" single type="file"  onChange={updateImages} />
                     <Button variant="outlined" component="span" > Image </Button>
                 </label>
                 </Stack>  
                 <div className = "display">
                 {
                 displayedImage.length === 0 ? <></> :
                <img width={150} alt={'user inputted'} src={displayedImage} height={150}  />
                 } 
                 </div>
                 </div>
             </div>
             <div className = "right">
            <ul className='recipe-list'>
            <div className='recipe-screen-header'>Recipe Results</div>
            <RecipeListItem />
            <RecipeListItem />
            <RecipeListItem />
        </ul>
        </div>
             </div>
    )
}