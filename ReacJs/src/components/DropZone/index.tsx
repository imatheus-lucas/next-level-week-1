import React, {useState,useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css'

import {FiUpload} from 'react-icons/fi'

interface Props {
  onFileUpLoade: (file:File) => void
}
const Dropzone:React.FC<Props> = ({onFileUpLoade}) => {

  const [selectedFileUrl, setSelectedUrl] = useState('');
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUr = URL.createObjectURL(file);

    setSelectedUrl(fileUr)
    onFileUpLoade(file);
  }, [onFileUpLoade])
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
   accept:'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        selectedFileUrl ?
        <img src={selectedFileUrl} alt="point thubnail"/>
        :(
<p>
       <FiUpload/>
       Imagem do estabelecimento</p>
        )
      }
     
    </div>
  )
}

export default Dropzone;