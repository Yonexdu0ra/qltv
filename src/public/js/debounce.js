
function debounce(func, delay = 300) {
    let timeoutId; // Biến này sẽ giữ ID của setTimeout

    // Trả về một hàm mới mà ta sẽ dùng để lắng nghe sự kiện
    return function (...args) {
        const context = this;

        // 1. Xóa timeout cũ nếu có (người dùng vẫn đang gõ)
        clearTimeout(timeoutId);

        // 2. Thiết lập timeout mới
        timeoutId = setTimeout(() => {
            // 3. Gọi hàm gốc (func) sau khi hết delay
            func.apply(context, args);
        }, delay);
    };
}
