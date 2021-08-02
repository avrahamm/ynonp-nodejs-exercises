// to delete post from index anf item pages
const deleteButtons = document.querySelectorAll('.deleteLink');
deleteButtons.forEach(function(deleteButton) {
    const postId = deleteButton.dataset.postId;
    deleteButton.addEventListener('click', function(e) {
        console.log('deleteButton postId = ' , postId);
        const deleteForm = document.querySelector(`#delete-post-${postId}`);
        deleteForm.submit();
    })
})