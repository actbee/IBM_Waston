

import React from 'react';
import UploadIcon from './UploadIcon.svg';
  /*
   Render the upload icon
   */
   export function renderIcon() {
      return <img src={UploadIcon} className="uploadIcon"	alt="Upload Icon" />;
  }

  /*
   Render label
   */

   const ERROR = {
    NOT_SUPPORTED_EXTENSION: 'NOT_SUPPORTED_EXTENSION',
    FILESIZE_TOO_LARGE: 'FILESIZE_TOO_LARGE'
  }

  export function renderLabel(labelClass, labelStyles, label) {
      return <p className={labelClass} style={labelStyles}>{label}</p>
  }

    /*
   Check if any errors && render
   */
   export function renderErrors() {
    const { fileErrors } = this.state;
    return fileErrors.map((fileError, index) => {
      return (
        <div className={'errorMessage ' + this.props.errorClass} key={index} style={this.props.errorStyle}>
          * {fileError.name} {fileError.type === ERROR.FILESIZE_TOO_LARGE ? this.props.fileSizeError: this.props.fileTypeError}
        </div>
      );
    });
  }

