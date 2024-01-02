import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PDFDocument } from "pdf-lib";
import { pdfjs } from "react-pdf";

const Home = () => {
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [stampImage, setStampImage] = useState<string | null>(null);
    const [pdfsize, setPdfSize] = useState<string>("");

    // 加载 PDF 文件
    const loadPdf = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPdfData(await pdfDoc.save());
        identifyPageSizes(pdfDoc);
    };

    // 处理盖章图片变更
    const handleStampImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setStampImage(imageUrl);
        }
    };

    // 盖章操作
    const stampPdf = async () => {
        if (pdfData && stampImage) {
            const stampImageArrayBuffer = await fetch(stampImage).then((res) =>
                res.arrayBuffer()
            );
            const stampImageBytes = new Uint8Array(stampImageArrayBuffer);

            const pdfDoc = await PDFDocument.load(pdfData);
            const stampImageXObject = await pdfDoc.embedPng(stampImageBytes);

            // 获取所有页面
            const pages = pdfDoc.getPages();

            // 遍历每一页
            for (let i = 0; i < pages.length; i++) {
                const currentPage = pages[i];
                const { width, height } = currentPage.getSize();

                // 获取当前图纸尺寸
                const currentPageSize = getPageSizeLabel(width, height);

                // 根据图纸尺寸设置不同的盖章位置
                let stampImageStamp1 = {};
                let stampImageStamp2 = {};

                switch (currentPageSize) {
                    case "A0":
                        // 设置 A0 文件盖章位置（左下角）
                        stampImageStamp1 = {
                            x: 50, // X 坐标
                            y: height - stampImageXObject.height * 0.1 - 50, // Y 坐标
                            width: stampImageXObject.width * 0.1, // 图片宽度
                            height: stampImageXObject.height * 0.1, // 图片高度
                        };
                        // 设置 A0 文件盖章位置（右下角）
                        stampImageStamp2 = {
                            x: width - stampImageXObject.width * 0.1 - 50, // X 坐标
                            y: height - stampImageXObject.height * 0.1 - 50, // Y 坐标
                            width: stampImageXObject.width * 0.1, // 图片宽度
                            height: stampImageXObject.height * 0.1, // 图片高度
                        };
                        break;
                    case "A4":
                        // 设置 A4 文件盖章位置（左上角）
                        stampImageStamp1 = {
                            x: 50, // X 坐标
                            y: 50, // Y 坐标
                            width: stampImageXObject.width * 0.1, // 图片宽度
                            height: stampImageXObject.height * 0.1, // 图片高度
                        };
                        // 设置 A4 文件盖章位置（右上角）
                        stampImageStamp2 = {
                            x: width - stampImageXObject.width * 0.1 - 50, // X 坐标
                            y: 50, // Y 坐标
                            width: stampImageXObject.width * 0.1, // 图片宽度
                            height: stampImageXObject.height * 0.1, // 图片高度
                        };
                        break;
                    default:
                        // 设置默认位置（你可以根据需要修改）
                        stampImageStamp1 = {
                            x: 100, // X 坐标
                            y: 100, // Y 坐标
                            width: stampImageXObject.width * 0.1, // 图片宽度
                            height: stampImageXObject.height * 0.1, // 图片高度
                        };
                        stampImageStamp2 = {
                            x: 200, // X 坐标
                            y: 200, // Y 坐标
                            width: stampImageXObject.width * 0.1, // 图片宽度
                            height: stampImageXObject.height * 0.1, // 图片高度
                        };
                }

                // 在当前页面上绘制盖章图片1
                currentPage.drawImage(stampImageXObject, stampImageStamp1);

                // 在当前页面上绘制盖章图片2
                currentPage.drawImage(stampImageXObject, stampImageStamp2);
            }

            // 保存修改后的 PDF 文档数据
            setPdfData(await pdfDoc.save());
            identifyPageSizes(pdfDoc);
        }
    };

    // 获取图纸尺寸标签
    const getPageSizeLabel = (width: number, height: number) => {
        const aspectRatio = width / height;

        if (aspectRatio > 1.4) {
            return "A0";
        } else if (aspectRatio > 1.2) {
            return "A1";
        } else if (aspectRatio > 0.9) {
            return "A2";
        } else {
            return "A4";
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
            return { width, height };
        });

        const pageSizesInfo = pageSizes.map((size: any, index: number) => {
            const aspectRatio = size.width / size.height;

            let pageSize = "";

            if (aspectRatio > 1.4) {
                pageSize = "A0";
            } else if (aspectRatio > 1.2) {
                pageSize = "A1";
            } else if (aspectRatio > 0.9) {
                pageSize = "A2";
            } else {
                pageSize = "A4";
            }

            return (
                <div key={index}>
                    {`第 ${index + 1}页 图纸尺寸: ${pageSize}`}
                </div>
            );
        });

        setPdfSize(pageSizesInfo);
    };

    return (
        <>
            <div>
                <h1>PDF 盖章应用</h1>
                <label htmlFor="pdfFileInput">
                    选择 PDF 文件
                    <input
                        id="pdfFileInput"
                        type="file"
                        onChange={(e) => loadPdf(e.target.files![0])}
                    />
                </label>
                <br />
                {/* <label htmlFor="stampImageInput">
                    选择盖章图片
                    <input
                        id="stampImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleStampImageChange}
                    />
                </label> */}

                <label htmlFor="stampImageInput">
                    选择印章一
                    <input
                        id="stampImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleStampImageChange}
                    />
                </label>

                <label htmlFor="stampImageInput">
                    选择印章二
                    <input
                        id="stampImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleStampImageChange}
                    />
                </label>
                <br />
                <button onClick={stampPdf}>盖章</button>
                <br />
                <button onClick={downloadStampedPdf}>下载盖章后的 PDF</button>
                <br />
                {pdfData && (
                    <>
                        <Worker workerUrl={`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                            <Viewer fileUrl={URL.createObjectURL(new Blob([pdfData], { type: "application/pdf" }))} />
                            {pdfsize}
                        </Worker>
                    </>
                )}
            </div>
        </>
    );
};

export default Home;
