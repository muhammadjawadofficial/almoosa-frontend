<template>
  <div>
    <footer class="footer">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12 footer-copyright text-center">
            <p class="mb-0">{{ $t("footer.allRights") }}</p>
            <div class="footer-icons">
              <a href="https://twitter.com/almoosahospital" target="_blank">
                <i class="fa fa-twitter"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/almoosa-specialist-hospital/"
                target="_blank"
              >
                <i class="fa fa-linkedin"></i>
              </a>
              <a
                href="https://www.instagram.com/almoosahospital/"
                target="_blank"
              >
                <i class="fa fa-instagram"></i>
              </a>
              <a
                href="https://www.youtube.com/channel/UCspHgrLVKETE06FNIFcBy3A"
                target="_blank"
              >
                <i class="fa fa-youtube"></i>
              </a>
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