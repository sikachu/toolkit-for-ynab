import Feature from 'core/feature';
import * as toolkitHelper from 'helpers/toolkit';

export default class DisplayTargetGoalAmount extends Feature {
  shouldInvoke() {
    return toolkitHelper.getCurrentRouteName().indexOf('budget') !== -1;
  }

  invoke() {
    $('.budget-table-header .budget-table-cell-name').css('position', 'relative');
    $('.budget-table-row.is-sub-category li.budget-table-cell-name').css('position', 'relative');

    $('.budget-table-header .budget-table-cell-name').append(
      $('<div>', { class: 'budget-table-cell-goal' }).css(
        { position: 'absolute', right: 0, top: '6px' }).append('GOAL')
    );

    $('.budget-table-row.is-sub-category li.budget-table-cell-name').append(
      $('<div>', { class: 'budget-table-cell-goal currency' }).css({
        background: '-webkit-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%,rgba(255,255,255,1) 100%)', position: 'absolute', 'font-size': '80%', 'padding-left': '.75em', 'padding-right': '1px', 'line-height': '2.55em'
      })
    );

    $('.budget-table-row.is-sub-category').each((index, element) => {
      const emberId = element.id;
      const viewData = toolkitHelper.getEmberView(emberId).data;
      const { subCategory } = viewData;
      const { monthlySubCategoryBudget } = viewData;
      const { monthlySubCategoryBudgetCalculation } = viewData;
      const goalType = subCategory.get('goalType');
      const monthlyFunding = subCategory.get('monthlyFunding');
      const targetBalance = subCategory.get('targetBalance');
      const targetBalanceDate = monthlySubCategoryBudgetCalculation.get('goalTarget');
      const budgetedAmount = monthlySubCategoryBudget.get('budgeted');
      const activity = Math.abs(monthlySubCategoryBudgetCalculation.get('cashOutflows'));
      if (goalType === 'MF') {
        $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').text(toolkitHelper.formatCurrency(monthlyFunding));
        if (activity <= monthlyFunding && budgetedAmount >= monthlyFunding) {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: '#00b300' });
        } else if (activity > monthlyFunding) {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: '#ff4545' });
        } else {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: 'grey' });
        }
      } else if (goalType === 'TB') {
        $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').text(toolkitHelper.formatCurrency(targetBalance));
        if (activity <= targetBalance && budgetedAmount >= targetBalance) {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: '#00b300' });
        } else if (activity > targetBalance) {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: '#ff4545' });
        } else {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: 'grey' });
        }
      } else if (goalType === 'TBD') {
        $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').text(toolkitHelper.formatCurrency(targetBalanceDate));
        if (activity <= targetBalanceDate && budgetedAmount >= targetBalanceDate) {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: '#00b300' });
        } else if (activity > targetBalanceDate) {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: '#ff4545' });
        } else {
          $('#' + emberId + '.budget-table-row.is-sub-category div.budget-table-cell-goal').css({ color: 'grey' });
        }
      }
    });
  }

  observe(changedNodes) {
    if (!this.shouldInvoke()) return;
    if (changedNodes.has('budget-table-cell-budgeted')) {
      $('.budget-table-cell-goal').remove();
      this.invoke();
    }
    if (changedNodes.has('budget-table-row is-sub-category') || changedNodes.has('budget-table-row is-sub-category is-checked') || changedNodes.has('budget-table-cell-goal currency')) {
      $('.budget-table-row.is-sub-category li.budget-table-cell-name .budget-table-cell-goal').css({
        background: '-webkit-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 10%,rgba(255,255,255,1) 100%)' });
      $('.budget-table-row.is-checked li.budget-table-cell-name .budget-table-cell-goal').css({ background: '#005a6e' });
    }
  }

  onRouteChanged() {
    if (!this.shouldInvoke()) return;
    this.invoke();
  }
}
