import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import ImageUploader from './component/index.js';
import { rainbow } from 'react-syntax-highlighter/styles/hljs';
import { getRecipies } from './component/recipies/recipies';


export default class App extends React.PureComponent {
    render() {
        return (
            <div className="page">
                <ImageUploader     withPreview={true} />
            </div>
          
        );
    }
}
