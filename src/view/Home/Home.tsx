import React, { useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PDFDocument } from "pdf-lib";
import { pdfjs } from "react-pdf";
import { Button, message } from 'antd';
import style from './home.module.scss'

// Import Button from "../../components/Button/Button";

const Home = () => {
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [pdfsize, setPdfSize] = useState<string>("");

    // 加载 PDF 文件
    const loadPdf = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPdfData(await pdfDoc.save());
        identifyPageSizes(pdfDoc);
    };

    const fileInputRefPdf = useRef<HTMLInputElement | null>(null);
    const fileInputRefStamp1 = useRef<HTMLInputElement | null>(null);
    const fileInputRefStamp2 = useRef<HTMLInputElement | null>(null);

    const handleStampImageButtonClick = (index: number) => {
        if (index === 1 && fileInputRefStamp1.current) {
            fileInputRefStamp1.current.click();
        } else if (index === 2 && fileInputRefStamp2.current) {
            fileInputRefStamp2.current.click();
        }
    };

    const handlePdfFileButtonClick = () => {
        if (fileInputRefPdf.current) {
            fileInputRefPdf.current.click();
        }
    };

    const [stampImage, setStampImage] = useState<string | null>(null);
    const [stampImage2, setStampImage2] = useState<string | null>(null);

    // 处理盖章图片变更
    const handleStampImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setStampImage(imageUrl);
        }
    };

    // 处理第二个盖章图片变更
    const handleStampImageChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setStampImage2(imageUrl);
        }
    };

    // 盖章操作
    const stampPdf = async () => {

        if (pdfData && stampImage && stampImage2) {
            const stampImageArrayBuffer = await fetch(stampImage).then((res) =>
                res.arrayBuffer()
            );
            const stampImageBytes = new Uint8Array(stampImageArrayBuffer);

            const stampImage2ArrayBuffer = await fetch(stampImage2).then((res) =>
                res.arrayBuffer()
            );
            const stampImageBytes2 = new Uint8Array(stampImage2ArrayBuffer);
            const pdfDoc = await PDFDocument.load(pdfData);
            const stampImageXObject = await pdfDoc.embedPng(stampImageBytes);
            const stampImageXObject2 = await pdfDoc.embedPng(stampImageBytes2);

            // 获取所有页面
            const pages = pdfDoc.getPages();
            console.log(pages);


            // 遍历每一页
            for (let i = 0; i < pages.length; i++) {
                const currentPage = pages[i];
                const { width, height } = currentPage.getSize();
                // 获取当前图纸尺寸
                const currentPageSize = getPageSizeLabel(width, height);
                // 根据图纸尺寸设置不同的盖章位置
                let stampImageStamp1 = {};
                let stampImageStamp2 = {};
                console.log(currentPageSize);
                switch (currentPageSize) {

                    case "A0":
                        // 设置 A0 文件盖章位置（左下角）
                        stampImageStamp1 = {
                            x: width - 170, // X 坐标
                            y: height - 1970, // Y 坐标
                            width: stampImageXObject.width * 0.6, // 图片宽度
                            height: stampImageXObject.height * 0.6, // 图片高度
                        };
                        // 设置 A0 文件盖章位置（右下角）
                        stampImageStamp2 = {
                            x: width - 170, // X 坐标
                            y: height - 2110, // Y 坐标
                            width: stampImageXObject2.width * 0.6, // 图片宽度
                            height: stampImageXObject2.height * 0.6, // 图片高度
                        };
                        break;
                    case "A1":
                        // 设置 A4 文件盖章位置（左上角）
                        stampImageStamp1 = {
                            x: width - 170, // X 坐标
                            y: height - 1265, // Y 坐标
                            width: stampImageXObject.width * 0.6, // 图片宽度
                            height: stampImageXObject.height * 0.6, // 图片高度
                        };
                        // 设置 A4 文件盖章位置（右上角）
                        stampImageStamp2 = {
                            x: width - 170, // X 坐标
                            y: height - 1405, // Y 坐标
                            width: stampImageXObject2.width * 0.6, // 图片宽度
                            height: stampImageXObject2.height * 0.6, // 图片高度
                        };
                        break;
                    case "A2":
                        // 设置 A4 文件盖章位置（左上角）
                        stampImageStamp1 = {
                            x: width - 170, // X 坐标
                            y: height - 750, // Y 坐标
                            width: stampImageXObject.width * 0.6, // 图片宽度
                            height: stampImageXObject.height * 0.6, // 图片高度
                        };
                        // 设置 A4 文件盖章位置（右上角）
                        stampImageStamp2 = {
                            x: width - 170, // X 坐标
                            y: height - 900, // Y 坐标
                            width: stampImageXObject2.width * 0.6, // 图片宽度
                            height: stampImageXObject2.height * 0.6, // 图片高度
                        };
                        break;
                    case "A3":
                        // 设置 A4 文件盖章位置（左上角）
                        stampImageStamp1 = {
                            x: width - 160, // X 坐标
                            y: height - 520, // Y 坐标
                            width: stampImageXObject.width * 0.6, // 图片宽度
                            height: stampImageXObject.height * 0.6, // 图片高度
                        };
                        // 设置 A4 文件盖章位置（右上角）
                        stampImageStamp2 = {
                            x: width - 160, // X 坐标
                            y: height - 580, // Y 坐标
                            width: stampImageXObject2.width * 0.6, // 图片宽度
                            height: stampImageXObject2.height * 0.6, // 图片高度
                        };
                        break;
                    case "A4":
                        // 设置 A4 文件盖章位置（左上角）
                        stampImageStamp1 = {
                            x: width - 150, // X 坐标
                            y: height - 200, // Y 坐标
                            width: stampImageXObject.width * 1, // 图片宽度
                            height: stampImageXObject.height * 1, // 图片高度
                        };
                        // 设置 A4 文件盖章位置（右上角）
                        stampImageStamp2 = {
                            x: width - 150, // X 坐标
                            y: height - 500, // Y 坐标
                            width: stampImageXObject2.width * 1, // 图片宽度
                            height: stampImageXObject2.height * 1, // 图片高度
                        };
                        break;

                    // default:
                    //     // 设置默认位置（你可以根据需要修改）
                    //     stampImageStamp1 = {
                    //         x: width + 100, // X 坐标
                    //         y: height + 100, // Y 坐标
                    //         width: stampImageXObject.width * 1, // 图片宽度
                    //         height: stampImageXObject.height * 1, // 图片高度
                    //     };
                    //     stampImageStamp2 = {
                    //         x: width + 150, // X 坐标
                    //         y: height + 150, // Y 坐标
                    //         width: stampImageXObject2.width * 1, // 图片宽度
                    //         height: stampImageXObject2.height * 1, // 图片高度
                    //     };
                }

                // 在当前页面上绘制盖章图片1
                currentPage.drawImage(stampImageXObject, stampImageStamp1);

                // 在当前页面上绘制盖章图片2
                currentPage.drawImage(stampImageXObject2, stampImageStamp2);

                console.log("============", stampImageStamp1, stampImageStamp2);

            }

            // 保存修改后的 PDF 文档数据
            setPdfData(await pdfDoc.save());
            identifyPageSizes(pdfDoc);
        }
    };

    // 获取图纸尺寸标签
    const getPageSizeLabel = (width: number, height: number) => {
        // 将实际宽高转换为毫米
        const widthInMillimeters = (width / 72) * 25.4;
        const heightInMillimeters = (height / 72) * 25.4;

        console.log("实际宽高（毫米）", widthInMillimeters, heightInMillimeters);

        // 根据毫米值计算图纸尺寸标签
        const aspectRatio = widthInMillimeters
        const aspectRatios = heightInMillimeters;

        if (widthInMillimeters > heightInMillimeters) {
            if (aspectRatios > 841 && aspectRatios < 842 && aspectRatio > 1188 && aspectRatio < 1190) {
                return "A0";
            } else if (aspectRatio > 841 && aspectRatio < 842 && aspectRatios > 594 && aspectRatios < 595) {
                return "A1";
            } else if (aspectRatio > 594 && aspectRatio < 595 && aspectRatios > 420 && aspectRatios < 421) {
                return "A2";
            } else if (aspectRatio > 420 && aspectRatio < 421) {
                return "A3";
            } else {
                return "A4";
            }
        } else if (widthInMillimeters < heightInMillimeters) {
            if (aspectRatios > 841 && aspectRatios < 842 && aspectRatio > 1189 && aspectRatio < 1190) {
                return "A0";
            } else if (aspectRatios > 841 && aspectRatios < 842 && aspectRatio > 594 && aspectRatio < 595) {
                return "A1";
            } else if (aspectRatios > 594 && aspectRatios < 595 && aspectRatio > 420 && aspectRatio < 421) {
                return "A2";
            } else if (aspectRatios > 420 && aspectRatios < 421 && aspectRatio > 297 && aspectRatio < 298) {
                return "A3";
            } else {
                return "A4";
            }
        }

    };


    // 下载盖章后的 PDF
    const downloadStampedPdf = () => {
        if (pdfData) {
            const blob = new Blob([pdfData], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "stamped_document.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    // 识别页面尺寸
    const identifyPageSizes = (pdfDoc: any) => {
        const pages = pdfDoc.getPages();
        const pageSizes = pages.map((page: any) => {
            const { width, height } = page.getSize();

            // 将实际宽高转换为毫米
            const widthInMillimeters = (width / 72) * 25.4;
            const heightInMillimeters = (height / 72) * 25.4;

            return { widthInMillimeters, heightInMillimeters };
        });

        const pageSizesInfo = pageSizes.map((size: any, index: number) => {
            const aspectRatio = size.widthInMillimeters
            const aspectRatios = size.heightInMillimeters
            let pageSize = "";
            let datas = ''

            console.log("宽高（毫米）", size.widthInMillimeters, size.heightInMillimeters);
            if (size.widthInMillimeters > size.heightInMillimeters) {
                datas = "横向"
                if (aspectRatios > 841 && aspectRatios < 842 && aspectRatio > 1188 && aspectRatio < 1190) {
                    pageSize = "A0";
                } else if (aspectRatio > 841 && aspectRatio < 842 && aspectRatios > 594 && aspectRatios < 595) {
                    pageSize = "A1";
                } else if (aspectRatio > 594 && aspectRatio < 595 && aspectRatios > 420 && aspectRatios < 421) {
                    pageSize = "A2";
                } else if (aspectRatio > 420 && aspectRatio < 421) {
                    pageSize = "A3";
                } else {
                    pageSize = "A4";
                }
            } else if (size.widthInMillimeters < size.heightInMillimeters) {
                datas = "纵向"
                if (aspectRatios > 841 && aspectRatios < 842 && aspectRatio > 1189 && aspectRatio < 1190) {
                    pageSize = "A0";
                } else if (aspectRatios > 841 && aspectRatios < 842 && aspectRatio > 594 && aspectRatio < 595) {
                    pageSize = "A1";
                } else if (aspectRatios > 594 && aspectRatios < 595 && aspectRatio > 420 && aspectRatio < 421) {
                    pageSize = "A2";
                } else if (aspectRatios > 420 && aspectRatios < 421 && aspectRatio > 297 && aspectRatio < 298) {
                    pageSize = "A3";
                } else {
                    pageSize = "A4";
                }
            }


            return (
                <div key={index}>
                    {`第 ${index + 1} 页 图纸尺寸: ${pageSize}  + 方向：${datas}`}
                </div>
            );
        });

        setPdfSize(pageSizesInfo);
    };




    const [messageApi, contextHolder] = message.useMessage();
    console.log(messageApi);
    

    // const success = () => {
    //     messageApi.open({
    //         type: 'success',
    //         content: 'This is a success message',
    //     });
    // };

    // const error = () => {
    //     messageApi.open({
    //         type: 'error',
    //         content: 'This is an error message',
    //     });
    // };

    // const warning = () => {
    //     messageApi.open({
    //         type: 'warning',
    //         content: 'This is a warning message',
    //     });
    // };



    return (
        <>
            <div className={style.content}>
                {contextHolder}
                <input
                    style={{ display: "none" }}
                    id="pdfFileInput"
                    type="file"
                    onChange={(e) => loadPdf(e.target.files![0])}
                    ref={fileInputRefPdf}
                />
                <Button onClick={handlePdfFileButtonClick}>
                    选择 PDF 文件
                </Button>
                <input
                    style={{ display: "none" }}
                    id="stampImageInput1"
                    type="file"
                    onChange={handleStampImageChange}
                    ref={fileInputRefStamp1}
                />
                <Button onClick={() => handleStampImageButtonClick(1)}>选择资质章</Button>
                <input
                    style={{ display: "none" }}
                    id="stampImageInput2"
                    type="file"
                    onChange={handleStampImageChange2}
                    ref={fileInputRefStamp2}
                />
                <Button onClick={() => handleStampImageButtonClick(2)}>工程师章</Button>
                <Button onClick={stampPdf}>盖章</Button>
                <Button onClick={downloadStampedPdf}>下载盖章后的 PDF</Button>
                {pdfData && (
                    <>
                        <Worker workerUrl={`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`} >
                            <div>
                                {pdfsize}
                            </div>
                            <Viewer fileUrl={URL.createObjectURL(new Blob([pdfData], { type: "application/pdf" }))} />
                        </Worker>
                    </>
                )}
            </div>
        </>
    );
};

export default Home;
