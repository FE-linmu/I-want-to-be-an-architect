<script>
export default {
  async asyncData ({ query, error }) {
    if (query.id) {
      return { user: { name: 'tom' } }
    }
    error({ statusCode: 400, message: '请传递用户id' })
  }
}
</script>