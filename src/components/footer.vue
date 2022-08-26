<template>
  <div>
    <footer class="footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 footer-copyright text-center">
            <p class="mb-0">{{ $t("footer.allRights") }}</p>
            <div class="footer-icons">
              <i class="fa fa-twitter"></i>
              <i class="fa fa-linkedin"></i>
              <i class="fa fa-facebook"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import json from "../data/menu";
export default {
  name: "footerpage",
  data() {
    return {
      customizer: false,
      data:
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(json)),
    };
  },
};
</script>
<style lang="scss" scoped>
.footer-copyright {
  p {
    font-size: 0.813rem;
  }
}
</style>