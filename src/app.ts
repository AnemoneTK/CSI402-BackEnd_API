import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

interface responseFormat {
  statusCode: number;
  status: string;
  message: string;
  detail?: string | object;
  data?: {
    stdId: string;
    point: number;
    totalPoint: number;
  };
}

app.post("/api/point/collect", (req: Request, res: Response) => {
  let point = 0;
  let totalPoint = 1000; //แต้มสะสมคงเหลือก่อนการทำรายการ
  const { stdId, totalPrice } = req.body;
  try {
    if (!stdId || !totalPrice) {
      const response: responseFormat = {
        statusCode: 400,
        status: "Bad Request",
        message: "ข้อมูลไม่ครบ",
        detail: "กรุณากรอกข้อมูล รหัสสมาชิก และ ค่าใช้จ่ายทั้งหมด",
      };
      res.status(400).json(response);
    }

    //อาจจะต้องมีการตรวจสอบรหัสสมาชิกว่า มีอยู่ในฐานข้อมูลด้วย

    //ถ้าไม่ถึง 100 ก็ไม่ได้แต้ม
    if (totalPrice >= 100) {
      point = Math.floor((totalPrice / 100) * 10);
    }

    totalPoint += point;
    const response: responseFormat = {
      statusCode: 200,
      status: "success",
      message: "สะสมแต้มสำเร็จ",
      data: {
        stdId: stdId,
        point: point,
        totalPoint: totalPoint,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    const err = error as Error;
    const response: responseFormat = {
      statusCode: 500,
      status: "error",
      message: "เกิดข้อผิดพลาดในการสะสมแต้ม",
      detail: err,
    };
    res.status(500).json(response);
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
