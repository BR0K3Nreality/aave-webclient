import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

  export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isAudio, setIsAudio] = useState<boolean>(false);
    const [uploadPercentage, setUploadPercentage] = useState<number>(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if(event.target.files && event.target.files.length > 0){
        const file = event.target.files[0];
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        if(file.type.startsWith("image/")){
          setIsAudio(false);
          setImageSrc(url);
        }else if(file.type.startsWith("audio/")){
          setIsAudio(true);
          setAudioSrc(url);
        }
      }
    };
  
    const onFileUpload = async () => {
      if(selectedFile){
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await axios.post("http://localhost:12345/convert", formData, {
          responseType: 'blob',
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadUrl(url);
      }
    };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center py-2">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 z-0">
        <rect fill="#000" width="100%" height="100%" />
        <path fill="green" d="M25,100 Q50,200, 75,100 Q100,0, 125,100 Q150,200, 175,100" opacity=".4"/>
        <path fill="green" d="M35,100 Q60,180, 85,100 Q110,20, 135,100 Q160,180, 185,100" opacity=".5"/>
        <path fill="green" d="M45,100 Q70,160, 95,100 Q120,40, 145,100 Q170,160, 195,100" opacity=".6"/>
      </svg>
      {/* Your application content */}
      <h2 className="text-3xl font-bold mb-5 text-white z-10">AAVE Client</h2>
      <div className="flex items-center justify-center z-10">
        <label className="flex flex-col border-4 border-dashed w-64 h-64 hover:border-blue-400 hover:bg-blue-50 group">
          <div className="flex flex-col items-center justify-center pt-7">
            {!isAudio && imageSrc && <Image src={imageSrc} alt="Upload Preview" width={200} height={200} objectFit="cover" />}
            <h1 className="text-gray-700 mt-20">Click to upload</h1>
            <input type="file" className="hidden" onChange={onFileChange} />
          </div>
        </label>
      </div>
      <button onClick={onFileUpload} className="w-64 bg-white tracking-wide text-black font-bold rounded-3xl hover:bg-gray-200 shadow-md py-2 px-6 inline-flex items-center mt-4 z-10">
        <span className="mx-auto">Upload and Convert</span>
      </button>
      {uploadPercentage > 0 &&
        <div className="mt-4 z-10">
        </div>
      }
      {isAudio && audioSrc &&
        <audio controls className="mt-4 z-10">
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio tag.
        </audio>
      }
        {downloadUrl &&
        <button className="mt-4 z-10">
          <a href={downloadUrl} download>
            Download Converted File
          </a>
        </button>
      }
    </div>
  );
}
