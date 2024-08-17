import { ConductorWorker, Task } from "@io-orkes/conductor-javascript";
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';

export const downloadtheRepoToEc2: ConductorWorker = {
  taskDefName: "task-downloadtheRepoToEc2",
  execute: async (task: Task) => {
    // Sample output
    const inputData = task.inputData;
    console.log("Input data: ", inputData);

    // Do your work here
    const downloadtheRepoToEc2BashScriptPath = "./downloadtheRepoToEc2.sh";
    const commander = promisify(exec);
    const { stdout, stderr } = await commander(
      `cd C:\\Users\\rocin\\github\\inf\\infinity-node\\orkes\\workers && bash downloadtheRepoToEc2.sh`);

    // write the stdout and stderr to the file
    fs.writeFileSync('output.txt', stdout + '\n' + stderr);

    console.log("Output: ", stdout, stderr);

    return {
      outputData: {
        hello: "From your worker task-downloadtheRepoToEc2" + inputData,
      },
      status: "COMPLETED",
    };
  },
};