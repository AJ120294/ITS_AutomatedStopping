import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // 모든 네트워크에서 접근 허용
    port: 3000,        // 포트 3000으로 변경
    strictPort: true,  // 사용 중이면 다른 포트로 변경하지 않음
  },
});
