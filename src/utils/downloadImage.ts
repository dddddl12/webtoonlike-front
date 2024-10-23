export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const rsp = await AdminApi.loadMedia({ key: url });
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = `${rsp.data}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e){
    alert("이미지 다운로드에 실패했습니다.");
  }
}