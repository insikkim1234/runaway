import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import WebCamTimer from './WebCamTimer';

const WebCamVideo = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [timer, setTimer] = useState(null); // timer 상태 추가
    const [elapsedTime, setElapsedTime] = useState(10);
    const [mimeType, setMimeType] = useState('');


    const handleDataAvailable = useCallback(({ data }) => {
        console.log("Data Available:", data);
        if (data.size > 0) {
            // setRecordedChunks((prev) => prev.concat(data));
            setRecordedChunks((prev) => [...prev, data]);
        }
    }, [setRecordedChunks]);

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

                    let type = 'video/webm';
                    if (!MediaRecorder.isTypeSupported(type)) {
                        type = 'video/mp4';
                        if (!MediaRecorder.isTypeSupported(type)) {
                            alert('모바일 브라우저에서 지원되지 않는 mimeType입니다.');
                            return;
                        }
                    }
                    setMimeType(type);

                    // let mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'; // MIME 유형 동적으로 결정
                    // mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                    mediaRecorderRef.current = new MediaRecorder(stream, {
                        // mimeType: "video/mp4"
                        mimeType: type
                    });

                    mediaRecorderRef.current.ondataavailable = handleDataAvailable;

                    mediaRecorderRef.current.onstop = () => {
                        // Handle the stop event if needed
                        setCapturing(false);
                    };

                }
            } catch (error) {
                console.error('Error initializing media recorder:', error);
            }
        };

        initializeMediaRecorder();
    }, [webcamRef, mediaRecorderRef, handleDataAvailable]);

    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            clearInterval(timer); // 타이머 멈춤
            // setCapturing(false);
            // setTimer(null);
            setElapsedTime(10); // 타이머 초기화
            // console.log("Stop capturing. Recorded chunks:", recordedChunks); // 확인을 위한 로그 추가
        }
    }, [mediaRecorderRef, timer]);

    const handleStartCaptureClick = useCallback(() => {

        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
            const stream = webcamRef.current.video.srcObject;
            mediaRecorderRef.current = new MediaRecorder(stream, {
                // mimeType: "video/mp4"
                mimeType: mimeType
            });

            mediaRecorderRef.current.ondataavailable = handleDataAvailable;

            mediaRecorderRef.current.onstop = () => {
                setCapturing(false);
            };

            const newTimer = setInterval(() => {
                setElapsedTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(newTimer);
                        handleStopCaptureClick();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setCapturing(true);
            setTimer(newTimer);
            setRecordedChunks([]);
            setElapsedTime(10); // 녹화 시작 시간을 10으로 재설정
            mediaRecorderRef.current.start();
        }
    }, [webcamRef, mediaRecorderRef, handleDataAvailable, mimeType, handleStopCaptureClick]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: mimeType
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display:none";
            a.href = url;
            a.download = `react-webcam-stream-capture.${mimeType.split('/')[1]}`;
            a.click();
            window.URL.revokeObjectURL(url);
            // const video = document.getElementById("video-replay");
            // video.src = url
        }
    }, [recordedChunks, mimeType]);

    const handleTouchStart = useCallback(() => {
        console.log("Start Capture button touched");
        // alert("버튼이 눌려요!");
        handleStartCaptureClick(); // 터치 시작 시 녹화 시작
    }, [handleStartCaptureClick]);

    const handleTouchStop = useCallback(() => {
        console.log("Stop Capture button touched");
        // alert("버튼이 눌려요!");
        handleStopCaptureClick(); // 터치 시작 시 녹화 시작
    }, [handleStopCaptureClick]);

    const handleTouchDownload = useCallback(() => {
        console.log("Start Capture button touched");
        // alert("버튼이 눌려요!");
        handleDownload(); // 터치 시작 시 녹화 시작
    }, [handleDownload]);

    return (
        <span className="WebCamContainer">
            <Webcam
                audio={false} //나중에 true 로 바꿔야 오디오도 녹음 됨
                ref={webcamRef}
                mirrored={true}
                videoConstraints={{
                    facingMode: 'user',
                    aspectRatio: window.innerWidth <= 768 && window.innerWidth > 360 ?
                        window.innerWidth / window.innerHeight : 360 / 740,
                    width: window.innerWidth <= 768 && window.innerWidth > 360 ? window.innerWidth : 360,
                    height: window.innerWidth <= 768 && window.innerWidth > 360 ? window.innerHeight : 720,
                }}
            />
            {/* <video id="video-replay" height="400" width="500" controls></video> */}
            {capturing ? (
                <button className="WebCamStopBtn" onClick={handleStopCaptureClick} onTouchStart={handleTouchStop}>Stop Capture</button>
            ) : (
                <button className="WebCamStartBtn" onClick={handleStartCaptureClick} onTouchStart={handleTouchStart}>Start Capture</button>
            )}
            {elapsedTime === 0 && !capturing && (
                <button className="WebCamStartBtn" onClick={handleStartCaptureClick} onTouchStart={handleTouchStart}>Start Capture</button>
            )}
            {recordedChunks.length > 0 && (
                <button className="WebCamVideoDownloadBtn" onClick={handleDownload} onTouchStart={handleTouchDownload}>Download</button>
            )}
            <WebCamTimer elapsedTime={elapsedTime} />
        </span>
    );
};

export default WebCamVideo;