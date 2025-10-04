const STATUS_BORROW = {
  BORROWED: "Đang mượn",
  RETURNED: "Đã trả",
  REQUESTED: "Đang yêu cầu mượn",
  APPROVED: "Đã duyệt, chờ lấy",
  CANCELLED: "Đã hủy",
  REJECTED: "Đã từ chối",
  EXPIRED: "Quá hạn",
};

const BORROW_STATUS_CONSTANTS = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  BORROWED: "BORROWED",
  RETURNED: "RETURNED",
  EXPIRED: "EXPIRED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
}

const STATUS_BORROW_REVERSE = {
  "Đang mượn": "BORROWED",
  "Đã trả": "RETURNED",
  "Đang yêu cầu mượn": "REQUESTED",
  "Đã duyệt, chờ lấy": "APPROVED",
  "Đã hủy": "CANCELLED",
  "Đã từ chối": "REJECTED",
  "Quá hạn": "EXPIRED",
};

// const STATUS

module.exports = {
  STATUS_BORROW,
  STATUS_BORROW_REVERSE,
  BORROW_STATUS_CONSTANTS,
};
