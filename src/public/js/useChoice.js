



async function useChoice(selector, apiURL, fnMap, options = {}) {
    try {
        const element = document.querySelector(selector);
        if(!element) return
        const choices = new Choices(element, {
            removeItemButton: true, // cho phép xóa tag
            searchEnabled: true, // bật tìm kiếm
            placeholderValue: "Gõ để tìm...",
            noResultsText: "Không tìm thấy kết quả",
            noChoicesText: "Không có lựa chọn nào",
            itemSelectText: "Nhấn để chọn",
            shouldSort: false,
            duplicateItemsAllowed: false,
            renderSelectedChoices: "always",
            loadingText: "Đang tìm kiếm dữ liệu...",
            ...options,
        });
        const showLoading = () => {
            choices.clearChoices();
            choices.setChoices([{ value: '', label: choices.config.loadingText, disabled: true }], 'value', 'label', false);
        };
        const handleSearch = async (value) => {
            try {
                // xử lý chỉ chuyển mảng fnMap khi apiURL khác null
                if(apiURL == null) {
                    choices.clearChoices();
                    const options = fnMap().filter(option => option.label.toLowerCase().includes(value.toLowerCase()));
                    choices.setChoices(options, 'value', 'label', true);
                    return;
                }
                const url = value.trim()
                    ? `${apiURL}?q=${encodeURIComponent(value)}`
                    : apiURL;
                const response = await fetch(url);
                const data = await response.json();
                const options = fnMap(data)
                choices.clearChoices();
                choices.setChoices(options, 'value', 'label', false);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        }
        const debouncedSearch = debounce(handleSearch, 300);
        element.addEventListener('search', function (event) {
            const value = event.detail.value;
                showLoading();
            debouncedSearch(value);
        });
        handleSearch('');
        const searchInput = element.parentElement.parentElement.querySelector('.choices__input--cloned');
        
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                if (e.target.value === '') {
                    handleSearch('');
                }
            });
        }
        return {
            choices,
            showLoading,
            handleSearch,
            element
        }
    } catch (error) {
        console.error("Error initializing Choices:", error);
    }
}