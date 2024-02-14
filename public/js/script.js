$(document).ready(function() {
    $('#table1').DataTable({
        order:[],
    });

    $('.deleteBtn').click(function() {
        const accountId = $(this).data('id');

        $.post('/delete', {id : accountId})
            .done(function(){
                window.location.reload();
            })
            .fail(function(e){
                console.log('Error: ', e);
            });
    });
});