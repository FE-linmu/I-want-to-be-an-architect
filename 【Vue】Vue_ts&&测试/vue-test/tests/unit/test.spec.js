function add(num1, num2) {
    return num1 + num2
}

// 测试套件 test suite
describe('Kaikeba', () => {
    // 测试用例 test case
    it('测试add函数', () => {
        // 断言 assert
        expect(add(1, 3)).toBe(4)
        expect(add(1, 3)).toBe(4)
        expect(add(-2, 3)).toBe(1)
    })
}) 

// 导入 Vue.js 和组件，进行测试
import Vue from 'vue'
import KaikebaComp from '@/components/Kaikeba.vue'

describe('KaikebaComp', () => {
  // 检查原始组件选项
  it('由created生命周期', () => {
    expect(typeof KaikebaComp.created).toBe('function')
  })

  // 评估原始组件选项中的函数的结果
  it('初始data是vue-text', () => {
    // 检查data函数存在性
    expect(typeof KaikebaComp.data).toBe('function')
	// 检查data返回的默认值
    const defaultData = KaikebaComp.data()
    expect(defaultData.message).toBe('vue-text')
  })
})