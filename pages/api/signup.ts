// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { spawn } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import axios from "axios";

type Data = {
  name: string;
};

const customers: any = {};
let port = 10000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.body.type == "login") {
    if (!customers[req.body.email]) {
      return res.status(400).json({ message: `Please register` });
    }

    if (customers[req.body.email].password != req.body.password) {
      return res.status(400).json({ message: `invalid credentials` });
    }

    return res
      .status(200)
      .json({ message: "Success", port: customers[req.body.email].port });
  }

  console.log(req.body);
  console.log({ customers });

  if (customers[req.body.email]) {
    return res.status(400).json({ message: `email already exists` });
  }

  port++;
  customers[req.body.email] = { password: req.body.password, port };

  await startDocker(req.body.email, req.body.password, port);

  res.status(200).json({ message: "Success", port });
}

const startDocker = (email: string, password: string, port: number) => {
  return new Promise((resolve, reject) => {
    const ls = spawn("docker", [
      "run",
      "-d",
      "-t",
      `--name=budibase-${port}`,
      "-p",
      `${port}:80`,
      // "-v",
      // `./dockerdata/${port}:/data`,
      "--restart",
      "unless-stopped",
      "budibase/budibase:latest",
    ]);

    ls.stdout.on("end", () => {
      console.log("proccess finished");
      console.log("email", email);

      // console.log("password :>> ", password);
      // todo: setinterval with health status check of docker container
      setTimeout(async () => {
        const registerUserOnBudiBase = await axios.post(
          `http://localhost:${port}/api/global/users/init`,
          {
            email,
            password,
            tenantId: "default",
          },
          {
            headers: {
              Accept: "application/json",
              // "Accept-Language": "en-US,en;q=0.9",
              // Connection: "keep-alive",
              // "Content-Type": "application/json",
              // Cookie:
              //   "budibase:init=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTk1MTU3Mzh9.HoJLlBT3CXrra-2GQxYXdP0gBjjzGjXfby4fLqjBR8Q; budibase:init.sig=O6UBanoChjxXH2AraE0zRWtnR_0; budibase:returnurl=/builder",
              // Origin: "http://localhost:10000",
              // Referer: "http://localhost:10000/builder/admin",
              // "Sec-Fetch-Dest": "empty",
              // "Sec-Fetch-Mode": "cors",
              // "Sec-Fetch-Site": "same-origin",
              // "User-Agent":
              //   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
              // "sec-ch-ua":
              //   '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
              // "sec-ch-ua-mobile": "?0",
              // "sec-ch-ua-platform": '"Linux"',
              // "x-budibase-api-version": "1",
              // "x-budibase-session-id": "c866aa2a87b3e49a3acc5ac051dc0995b57",
            },
          }
        );
        console.log("registerUserOnBudiBase :>> ", registerUserOnBudiBase.data);
        // console.log("registerUserOnBudiBase :>> ", registerUserOnBudiBase);

        // auto login
        // const loginResponse = await axios.post(
        //   `http://localhost:${port}/api/global/auth/login`,
        //   {
        //     username:email,
        //     password,
        //     // tenantId: "default",
        //   },
        //   {
        //     headers: {
        //       Accept: "application/json",
        //     },
        //   }
        // );

        // console.log({loginResponse});

        resolve(0);

        // return registerUserOnBudiBase;
      }, 20000);
    });

    ls.stdout.on("error", (error) => {
      console.log(error);

      resolve(0);
    });
  });
};