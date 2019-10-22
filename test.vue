// 通知父类新增事件，若未指定事件名则函数名作为事件名（羊肉串形式）
@Emit()
private addFeature(event:any){  // 若没有返回值形参将作为事件参数
  const feature={name:event.target.value,id:this.features.length+1};
  this.features.push(feature);
  event.target.value='';
  return feature; // 返回值作为事件参数
}