function endBattle(status) {
    $('body').addClass('the-end').removeClass('battle');
    globalFunctionStop = 1;
    var $statusBlock = $('#final-status'),
        text = '';

    if (status === 1) {
        text = $statusBlock.data('win-text');
    } else {
        text = $statusBlock.data('lose-text');
    }

    $statusBlock.text(text);
}

$(function() {
    $('#restart').on('click', function() {
        location.reload();
    });

    //todo Обработчики для временных кнопок

    $('#you-win').on('click', function() {
        endBattle(1);
    });
    $('#you-lose').on('click', function() {
        endBattle(0);
    });
});
