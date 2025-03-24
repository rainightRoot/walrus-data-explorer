<script>
import { format, formatDistance } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export default {
  // ...
  methods: {
    formatTime(time) {
      return format(new Date(time), 'MMM dd, yyyy', { locale: enUS })
    },
    // ... other methods
  }
}
</script> 