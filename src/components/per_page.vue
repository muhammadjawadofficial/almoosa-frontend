<template>
  <b-form-group
    label-cols="2"
    :label="$t('perPage')"
    class="mb-0 datatable-select"
  >
    <b-form-select
      :value="getPerPageSelection"
      @input="updatePerPageSelection"
      :options="getPerPageOption"
    >
      <b-form-select-option :value="9999999">{{ $t("all") }}</b-form-select-option>
    </b-form-select>
  </b-form-group>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("user", ["getPerPageSelection", "getPerPageOption"]),
  },
  methods: {
    ...mapActions("user", ["setPerPageSelection"]),
    updatePerPageSelection(value) {
      this.setPerPageSelection(value);
    },
  },
};
</script>

<style>
</style>