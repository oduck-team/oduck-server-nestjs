import * as fs from 'fs';
import * as path from 'path';

function findControllerFiles(): string[] {
  const srcFolderPath = './src'; // src 폴더 경로 설정
  const controllerFilePaths: string[] = [];

  function searchForControllerFiles(currentPath: string) {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        searchForControllerFiles(filePath);
      } else if (file.endsWith('.controller.ts')) {
        controllerFilePaths.push(filePath);
      }
    });
  }

  searchForControllerFiles(srcFolderPath);
  return controllerFilePaths;
}

export const controllerFilePaths: string[] = findControllerFiles();
