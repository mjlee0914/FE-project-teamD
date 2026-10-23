// 이미지 크기 제한 (서버·브라우저가 같은 값을 씀)
// - 서버 액션 요청 본문이 1MB로 제한돼 있어서(next.config의 serverActions.bodySizeLimit 기본값),
//   이미지 외 입력값까지 포함해도 넘지 않게 800KB로 둠. 이 제한은 서버 코드보다 먼저 걸려서
//   서버 검증 문구를 못 보여 주므로 브라우저에서도 미리 막음(PostForm)
// - 서버 전용 코드(Buffer)가 들어 있는 imageUpload.ts와 분리한 이유: 클라이언트 컴포넌트가 이 값만 가져다 쓰려고
// - 제한을 바꿀 때(예: main의 bodySizeLimit 50mb 병합 뒤 5MB)는 이 파일의 숫자만 고치면 됨
export const MAX_IMAGE_BYTES = 800 * 1024;
export const MAX_IMAGE_LABEL = '800KB';
