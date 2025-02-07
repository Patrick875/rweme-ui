import { notification } from "ant-design-vue";

const allowedImageUploadTypes = ["image/png", "image/jpeg", "image/jpg"];

export function validateFileOnChange(
  info: any,
  fileList: any,
  isClientDetails: boolean = false
): any {
  const isAllowedType = allowedImageUploadTypes.includes(info.file.type);
  if (!isAllowedType) {
    notification.error({
      message: "Wrong file format",
      description: "The allowed file types are jpeg,jpg and png.",
      duration: 7,
    });
    return null;
  }
  const isFileSizeValid = info.file.size / 1024 / 1024 <= 5;
  if (!isFileSizeValid) {
    notification.error({
      message: "Upload size too large.",
      description: "Please upload a file that is less than 5MBs.",
      duration: 7,
    });
    return null;
  }
  if (isClientDetails) {
    fileList.value = [
      (info.fileList as any[])[info.fileList.length - 1],
    ] as never[];
  } else {
    fileList.value = info.fileList;
  }
}
export function validateFileBeforeUpload(file: any): any {
  const isAllowedType = allowedImageUploadTypes.includes(file.type);

  if (!isAllowedType) {
    notification.error({
      message: "Wrong file format",
      description: "The allowed file types are jpeg,jpg and png.",
      duration: 7,
    });
    return null;
  }
  const isFileSizeValid = file.size / 1024 / 1024 <= 5;
  if (!isFileSizeValid) {
    notification.error({
      message: "Upload size too large.",
      description: "Please upload a file that is less than 5MBs.",
      duration: 7,
    });
    return null;
  }

  return file;
}
