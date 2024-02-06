import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebCamVideo = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);


    const handleDataAvailable = useCallback(({ data }) => {
        console.log("Data Available:", data);
        if (data.size > 0) {
            // setRecordedChunks((prev) => prev.concat(data));
            setRecordedChunks((prev) => [...prev, data]);
        }
    }, [setRecordedChunks]);

    // const initializeMediaRecorder = useCallback(async () => {
    //     try {
    //         const devices = await navigator.mediaDevices.enumerateDevices();
    //         const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');

    //         if (videoInputDevices.length === 0) {
    //             alert('해당 기기에 카메라가 발견되지 않았습니다. 카메라를 연결해주세요.');
    //             return;
    //         }

    //         // if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
    //         if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
    //             // mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
    //             const stream = webcamRef.current.video.srcObject;
    //             mediaRecorderRef.current = new MediaRecorder(stream, {
    //                 mimeType: "video/webm"
    //             });
    //             // mediaRecorderRef.current.addEventListener(
    //             //     "dataavailable",
    //             //     handleDataAvailable
    //             // );
    //             mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    //             // mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
    //             // mediaRecorderRef.current.ondataavailable = (event) => {
    //             //     if (event.data.size > 0) {
    //             //         console.log("Data available:", event.data);
    //             //         setRecordedChunks((prev) => [...prev, event.data]);
    //             //     }
    //             // };
    //         }
    //     } catch (error) {
    //         console.error('Error initializing media recorder:', error);
    //     }
    // }, [webcamRef, mediaRecorderRef, handleDataAvailable]);

    useEffect(() => {
        const initializeMediaRecorder = async () => {

            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');

                if (videoInputDevices.length === 0) {
                    alert('해당 기기에 카메라가 발견되지 않았습니다. 카메라를 연결해주세요.');
                    return;
                }

                if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
                    const stream = webcamRef.current.video.srcObject;
                    // mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                    mediaRecorderRef.current = new MediaRecorder(stream, {
                        mimeType: "video/webm"
                    });

                    // mediaRecorderRef.current.addEventListener(
                    //     "dataavailable",
                    //     handleDataAvailable
                    // );

                    mediaRecorderRef.current.ondataavailable = handleDataAvailable;

                    mediaRecorderRef.current.onstop = () => {
                        // Handle the stop event if needed
                        setCapturing(false);
                    };

                    mediaRecorderRef.current.onstart = () => {
                        // Handle the start event if needed
                        setCapturing(true);
                    };

                    // mediaRecorderRef.current.start();
                }
            } catch (error) {
                console.error('Error initializing media recorder:', error);
            }
        };

        initializeMediaRecorder();
    }, [webcamRef, mediaRecorderRef, handleDataAvailable]);

    const handleStartCaptureClick = useCallback(() => {
        // initializeMediaRecorder();

        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
            const stream = webcamRef.current.video.srcObject;
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: "video/webm"
            });

            mediaRecorderRef.current.ondataavailable = handleDataAvailable;

            mediaRecorderRef.current.onstop = () => {
                setCapturing(false);
            };

            mediaRecorderRef.current.onstart = () => {
                setCapturing(true);
            };
            setRecordedChunks([]);
            mediaRecorderRef.current.start();
        }
        // if (mediaRecorderRef.current) {
        //     if (mediaRecorderRef.current.state === "recording") {
        //         // Start capturing 전에 기존 레코딩 초기화
        //         // setRecordedChunks([]);
        //         // mediaRecorderRef.current.start();
        //         mediaRecorderRef.current.stop();
        //     }
        //     setRecordedChunks([]);
        //     mediaRecorderRef.current.start();
        //     // setCapturing(true);
        // }
        // setRecordedChunks([]);
        // setCapturing(true);
        // mediaRecorderRef.current.start();
        // }, [setRecordedChunks, mediaRecorderRef, setCapturing]);
    }, [webcamRef, mediaRecorderRef, handleDataAvailable]);

    // const handleStartCaptureClick = useCallback(() => {
    //     setCapturing(true);
    //     const stream = webcamRef.current.video.srcObject;
    //     mediaRecorderRef.current = new MediaRecorder(stream, {
    //         mimeType: "video/webm"
    //     });
    //     mediaRecorderRef.current.addEventListener(
    //         "dataavailable",
    //         handleDataAvailable
    //     );
    //     mediaRecorderRef.current.start();
    // }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);


    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            // mediaRecorderRef.current.addEventListener(
            //     "dataavailable",
            //     handleDataAvailable
            // );
            mediaRecorderRef.current.stop();
            // setRecordedChunks([]);
            // console.log("Stop capturing. Recorded chunks:", recordedChunks); // 확인을 위한 로그 추가
        }
        // setCapturing(false);
        // mediaRecorderRef.current.stop();
        // setCapturing(false);
        // }, [mediaRecorderRef, setCapturing, handleDataAvailable]);
        // setRecordedChunks(prev => [...prev]); // This line triggers an update
        // }, [mediaRecorderRef, setCapturing]);
    }, [mediaRecorderRef]);


    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display:none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            // setRecordedChunks([]);
        }
    }, [recordedChunks]);

    // useEffect(() => {
    //     console.log("Recorded chunks:", recordedChunks);
    // }, [recordedChunks]);

    // const videoConstraints = {
    //     // aspectRatio: 360 / 740,
    //     aspectRatio: window.innerWidth <= 768 && window.innerWidth > 360 ?
    //         window.innerWidth / window.innerHeight : 360 / 740,
    //     // aspectRatio:
    //     //     window.innerHeight / window.innerWidth,
    //     facingMode: "user",
    //     // width: { min: 360 },
    //     // height: { min: 720 }
    //     width: window.innerWidth <= 768 && window.innerWidth > 360 ? window.innerWidth : 360,
    //     height: window.innerWidth <= 768 && window.innerWidth > 360 ? window.innerHeight : 720,
    // };

    return (
        <span className="WebCamContainer">
            <Webcam

                audio={false} //나중에 true 로 바꿔야 오디오도 녹음 됨
                ref={webcamRef}
                // height={740}
                // style={{ width: '100vw', height: '100vh' }}
                // videoConstraints={videoConstraints}
                videoConstraints={{
                    facingMode: 'user',
                    width: window.innerWidth <= 768 && window.innerWidth > 360 ? window.innerWidth : 360,
                    height: window.innerWidth <= 768 && window.innerWidth > 360 ? window.innerHeight : 720,
                }}
            />
            {capturing ? (
                <button className="WebCamStopBtn"
                    onClick={handleStopCaptureClick}>Stop Capture</button>
            ) : (
                <button className="WebCamStartBtn"
                    onClick={handleStartCaptureClick}>Start Capture</button>
            )}
            {recordedChunks.length > 0 && (
                <button className="WebCamVideoDownloadBtn"
                    onClick={handleDownload}>Download</button>
            )}
        </span>
    );
};

export default WebCamVideo;