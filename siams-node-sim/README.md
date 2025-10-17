# Flow đăng ký device

1. Device check deviceId đã tồn tại ở bộ nhớ trong chưa
   - No: sử dụng device và skip registration
   - Yes:
     - tạo một tempId(*) ngẫu nhiên (tốt nhất là uuid để chánh trùng với node khác),
     - tạo regPayLoad với inteface của DeviceRegisterDTO bên backend và gán tempId vào payload
     - publish payload tới topic .../clusters/{clusterId}/register/{tempId}
     - chờ message từ backend gửi đến broker và lưu deviceId nếu fail log lỗi và exit
2. Device check danh sách sensor đã có id chưa nếu

- Đã tồn tại: skip
