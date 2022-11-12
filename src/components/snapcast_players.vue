<template>
  <div v-for="player in active_players" :key="player.id">
    <player_view_item :player="player"/>
  </div>
  <div v-for="player in inactive_players" :key="player.id">
    <player_view_item :player="player"/>
  </div>
</template>
<script lang="ts">
import {defineComponent, inject, computed} from "vue";
import player_view_item from "./player_view_item.vue";
import {snapcast_service} from "@/services/snapcast_service";

export default defineComponent({
  name: 'snapcast_players',
  components: {
    player_view_item
  },
  setup() {
    const snapcastService = (inject('snapcast_service') as snapcast_service);

    const players = snapcastService.players;

    const active_players = computed(() => players.value.filter((pl) => !pl.is_idle));
    const inactive_players = computed(() => players.value.filter((pl) => pl.is_idle));

    return {
      players,
      active_players,
      inactive_players,
    }
  }
});


</script>

<style lang="css" scoped>

</style>