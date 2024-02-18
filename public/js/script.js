$(document).ready(function() {

    $('#table1').DataTable({
        order:[],
        scrollX: true,
    });

    $('#table2').DataTable({
        order: [],
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


async function getBalanceAddress(){
    const privateKey = document.querySelector('[name="fromPrivatekey"]').value;

    try {
        const response = await fetch('/getbalanceaddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {privateKey} )
        });

        const data = await response.json();
        document.getElementById('address').textContent = `Address: ${data.address}`;
        document.getElementById('name').textContent = `Name: ${data.name}`;
        document.getElementById('balance').textContent = `Balance: ${data.balance}`;

        document.getElementById('fromAddress').value = data.address;
        document.getElementById('fromPrivatekeyInput').value = data.privateKey;
    } catch(e) {
        console.log('Error: ', e);
    }
}