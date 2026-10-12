const path = require("path");
const fs = require("fs");
const { promisify}=require("util");

const readdir=promisify(fs.readdir);
const copyFile=promisify(fs.copyFile);



async function revert(commitID){
    const repoPath=path.resolve(process.cwd(),".myGit");
    const commitsPath = path.join(repoPath, "commits");

    try{
        const commitDir=path.join(commitsPath, commitID);
        const files=await readdir(commitDir);
        const parentDir=path.resolve(repoPath,"..");

        for(const file of files){
            await copyFile(path.join(commitDir,file),path.join(parentDir,file));

        }
        console.log(`commit with ${commitID} reverted successfully`)

    }catch(err){
        console.log("error occured while reverting:",err)
    }


}
module.exports={revert}