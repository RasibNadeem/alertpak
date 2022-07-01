import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import MultipleDropzoneExample from "../../../containers/forms/MultipleDropzoneExample";
import {Colxx} from "../../../components/common/CustomBootstrap";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import {multipartConfig} from "../../../config/env";
import {NotificationManager} from "../../../components/common/react-notifications";
import {withRouter} from 'react-router-dom'

const FileUpload = (props) => {
  const [files, setFile] = useState([]);
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [images, setImages] = useState("");

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(files)
    const data = new FormData();
    files.forEach(file =>{
      data.append('videos', file)
    })
    // data.append('videos', files);

    let response = await ApiCall.post(`${Url.STORE_EVENT_VIDEO}/${props.match.params.id}`, data, await multipartConfig());

    try {
      //
      // const res = await axios.post('/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      //   ,
      //   onUploadProgress: progressEvent => {
      //     setUploadPercentage(
      //       parseInt(
      //         Math.round((progressEvent.loaded * 100) / progressEvent.total)
      //       )
      //     );
      //
      //     // Clear percentage
      //     setTimeout(() => setUploadPercentage(0), 10000);
      //   }
      // });
      //
      // const { fileName, filePath } = res.data;
      //
      // setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };


  const handleChangeImages  = (file) => {
    console.log(file)
    let videos = files;
    videos.push(file)
    setFile([...files])
  }

  const removeImage = (file) => {
    if(file){
      setImages(
         ""
      )
    }
  }

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        {/*<div className='custom-file mb-4'>*/}
        {/*  <input*/}
        {/*    type='file'*/}
        {/*    className='custom-file-input'*/}
        {/*    id='customFile'*/}
        {/*    multiple*/}
        {/*    onChange={onChange}*/}
        {/*  />*/}
        {/*  <label className='custom-file-label' htmlFor='customFile'>*/}
        {/*    {filename}*/}
        {/*  </label>*/}
        {/*</div>*/}
        <MultipleDropzoneExample
            fileTypes="video/*"
            onChange={handleChangeImages}
            removeFile={removeImage}
        />
        <h2> </h2>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default withRouter(FileUpload);
