function dispatchSelectForm(selectorForm, selectorSelect) {
    const select = document.querySelector(selectorSelect);
    const searchForm = document.querySelector(selectorForm);
    select.addEventListener('change',function () {
      searchForm.submit();
    })
}