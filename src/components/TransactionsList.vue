<script>
import { formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  // ...
  methods: {
    formatTime(time) {
      return formatDistance(
        new Date(time),
        new Date(),
        { addSuffix: true, locale: enUS }
      )
    },
    // ... other methods
  }
}
</script> 