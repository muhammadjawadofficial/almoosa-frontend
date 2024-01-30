<template>
  <div
    class="find-specialist-container only-back-container page-body-container standard-width"
  >
    <back-navigation />
    <div
      class="specialist-section find-specialist-container-section block-section"
      style="position: relative"
    >
      <div class="heading-section">
        <div class="heading-icon">
          <img src="../../assets/images/speciality.svg" alt="speciality-icon" />
        </div>
        <div class="cc">
          <div class="heading-title">
            {{ $t("symptoms.symptom") }}
          </div>
          <div class="heading-subTitle">
            {{ $t("symptoms.findSymptoms") }}
          </div>
        </div>
      </div>
      <div class="body-section" v-if="nextSlideCount == 0">
        <h3 class="gender-sub-title pb-3">
          {{ $t("symptoms.selectGender") }}
        </h3>
        <div class="gender-container">
          <div
            class="gender"
            v-for="gender in genders"
            :key="'find-speciality-' + gender.id"
            @click="setSelectedSpeciality(gender)"
            :class="{ active: gender.status }"
          >
            <div class="gender-label">
              {{ gender[getLocaleKey("label")] }}
            </div>
            <div class="gender-img">
              <img :src="getImageUrl(gender.img)" alt="icon" />
            </div>
          </div>
        </div>
      </div>
      <div class="body-section range" v-if="nextSlideCount == 1">
        <div class="heading-title range-heading">
          {{ $t("symptoms.selectAge") }}
        </div>
        <div class="wrapper">
          <div class="range">
            <input
              type="range"
              v-model="age"
              :min="minValue"
              :max="maxValue"
              id="range"
              ref="range"
              class="ranger"
            />
          </div>
        </div>
        <div class="range-age">{{ $t("symptoms.age") }} : {{ age }}</div>
      </div>
      <div class="body-section" v-if="nextSlideCount == 2">
        <div class="specialities-container">
          <div class="">
            <div
              class="form-check"
              style="align-items: center"
              v-for="option in options"
              :key="option.id"
            >
              <h2 class="heading-title" style="">
                {{ option[getLocaleKey("title")] }}
              </h2>
              <div class="heading-subTitle mb-4">
                {{ option[getLocaleKey("description")] }}
              </div>
              <div
                class="checkbox-wrapper"
                v-for="q in option.options"
                :key="q.id"
                style="margin-bottom: 2rem"
              >
                <div class="checkBox-main">
                  <div class="checkbox-wrapper">
                    <input
                      type="checkbox"
                      v-model="checker"
                      :value="q.id"
                      :id="q.id"
                      :disabled="
                        selectedRecommendation != null &&
                        selectedRecommendation != q.recommendation
                      "
                    />
                    <label class="check-box" :for="q.id"></label>
                  </div>
                  <div class="label-of-option">
                    <label :for="q.id" class="label-input">
                      {{ q[getLocaleKey("title")] }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="body-section" v-if="nextSlideCount == 3">
        <h2 class="heading-title py-2">{{ $t("symptoms.afterSubmitted") }}</h2>
        <b-card
          header-tag="div"
          no-body
          class="ash-card bg-tertiary card-rounded"
        >
          <b-card-body class="mt-0">
            <div class="appointment-detail">
              <div class="appointment-detail--type">
                <div class="appointment-detail--label">
                  {{ $t("symptoms.genderChecker") }}
                </div>
                <div class="appointment-detail--value">
                  {{ surveyResult.gender || "N/A" }}
                </div>
              </div>
              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("symptoms.age") }}
                </div>
                <div class="appointment-detail--value">
                  {{ surveyResult.age || "N/A" }}
                </div>
              </div>
              <div
                class="appointment-detail--sepecialist"
                v-for="(it, i) in surveyResult.items"
                :key="i"
              >
                <div class="appointment-detail--label">
                  {{ it.symptom[getLocaleKey("title")] }}
                </div>
                <div class="appointment-detail--value">
                  {{ it.option_selected[getLocaleKey("title")] }}
                </div>
              </div>

              <div class="appointment-detail--sepecialist">
                <div class="appointment-detail--label">
                  {{ $t("symptoms.recommendation") }}
                </div>
                <div class="appointment-detail--value">
                  {{ selectedRecommendation }}
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
    <div class="datetime-section symptoms-btns">
      <button
        v-if="!(nextSlideCount == 3)"
        @click="nextslide"
        class="btn btn-primary"
      >
        {{ $t("modules.next") }}
      </button>
      <button
        @click="backSlide"
        v-if="nextSlideCount !== 0"
        class="btn btn-secondary"
      >
        {{ $t("modules.back") }}
      </button>
    </div>
  </div>
</template>
    
    <script>
import { mapGetters } from "vuex";
import { symptopChecker } from "../../services";
export default {
  data() {
    return {
      speciality: {},
      age: 0,
      minValue: 0,
      maxValue: 100,
      nextSlideCount: 0,
      surveyResult: null,
      genders: [
        {
          id: "1",
          img: require("../../assets/images/male.svg"),
          label: "Male",
          label_ar: "ذكر",
          status: false,
        },
        {
          id: "2",
          img: require("../../assets/images/female.svg"),
          label: "Female",
          label_ar: "أنثى",
          status: false,
        },
        {
          id: "3",
          img: require("../../assets/images/transgender.svg"),
          label: "Other",
          label_ar: "آخر",
          status: false,
        },
      ],
      options: null,
      checker: [],
      checkedData: [],
      selectedGender: null,
      selectedRecommendation: null,
      selecttedOptions: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  watch: {
    checker: {
      handler(newValue) {
        this.otherCheckBoxDisable(newValue);
      },
      deep: true,
    },
    age: {
      handler(newVal) {
        this.updateSliderStyles(newVal);
      },
      immediate: true,
    },
  },
  mounted() {
    this.speciality = JSON.parse(this.$route.query.speciality || "{}");
    this.initializeData();
    this.updateSliderStyles(this.age);
  },
  methods: {
    updateSliderStyles(value) {
      if (this.$refs.range) {
        const progress = (value / this.maxValue) * 100;
        if (localStorage.getItem("user-layout") == "rtl") {
          this.$refs.range.style.background = `linear-gradient(to left, #2b4e66 ${progress}%, #eff4ff ${progress}%)`;
        } else {
          this.$refs.range.style.background = `linear-gradient(to right, #2b4e66 ${progress}%, #eff4ff ${progress}%)`;
        }
      }
    },
    postData() {
      let items = [];
      if (this.checker.length && this.options) {
        this.checker.forEach((el) => {
          items.push({
            symptom_id: this.options[0].id,
            option_selected_id: el,
          });
        });
      }
      let data = {
        speciality_id: this.speciality,
        patient_id: this.getUserInfo.id,
        recommendation: this.options[0].options[0].recommendation,
        age: +this.age,
        gender: this.selectedGender,
        items,
      };
      symptopChecker.pData(data).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data;
            if (data.id) {
              this.getSymptomsData(data.id);
            }
          } else {
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    getSymptomsData(id) {
      symptopChecker.getData(id).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data;
            this.surveyResult = data;
          } else {
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    nextslide() {
      if (this.nextSlideCount !== 3) {
        setTimeout(() => {
          this.updateSliderStyles(this.age);
        }, 50);

        if (!this.selectedGender) {
          this.failureToast(this.$t("symptoms.noSelectedGender"));
          return false;
        }

        if (this.selectedGender && this.nextSlideCount == 0) {
          this.nextSlideCount++;
          return;
        }

        if (this.nextSlideCount == 1) {
          if (this.age <= 14) {
            this.failureToast(this.$t("symptoms.noSelectedAge"));
            return false;
          }
        }

        if (this.age && this.nextSlideCount == 1) {
          this.nextSlideCount++;
        }
        if (this.checker.length && this.nextSlideCount == 2) {
          this.nextSlideCount++;
        }
      }

      if (this.nextSlideCount == 3) {
        this.postData();
      }
    },
    backSlide() {
      if (this.nextSlideCount == 3) {
        this.nextSlideCount = 0;
        this.selectedGender = null;
        this.age = 0;
        this.checker = [];
        this.genders.forEach((el) => {
          el.status = false;
        });
        this.updateSliderStyles(this.age);
        return false;
      }
      if (this.backSlide !== 0) {
        setTimeout(() => {
          this.updateSliderStyles(this.age);
        }, 50);
        this.nextSlideCount--;
      }
    },
    initializeData() {
      let id = `speciality_id=${this.speciality}`;
      symptopChecker.fetchSymptoms(id).then(
        (response) => {
          if (response.data.status) {
            let data = response.data.data.items;
            this.options = data;
          } else {
            this.failureToast(response.data.messsage);
          }
        },
        (error) => {
          if (!this.isAPIAborted(error))
            this.failureToast(
              error.response &&
                error.response.data &&
                error.response.data.message
            );
        }
      );
    },
    otherCheckBoxDisable() {
      this.selectedRecommendation = null;
      if (this.checker.length) {
        this.options.forEach((el) => {
          let obj = el.options.find((el) => el.id == this.checker[0]);
          if (obj) {
            this.selectedRecommendation = obj.recommendation;
          }
        });
      }
    },
    setSelectedSpeciality(gender) {
      this.genders.forEach((data) => {
        if (data.id === gender.id) {
          data.status = true;
          this.selectedGender = data.label;
        } else {
          data.status = false;
        }
      });
    },
  },
};
</script>
    
    <style lang="scss" scoped>
.ranger {
  cursor: pointer;
}
.checkBox-main {
  display: flex;
  gap: 1rem;
}
.label-of-option {
  margin-top: -7px;
}
.com {
  font-size: 1.1rem;
  margin: 0;
}
.symptoms-btns {
  display: flex;
  gap: 10px;
  bottom: 200px;
}
.gender-sub-title {
  font-size: 1.3rem;
}
.gender-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.gender {
  border: 1px solid rgb(217, 214, 214);
  width: 12rem;
  height: 12rem;
  padding: 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  cursor: pointer;
  border-radius: 1rem;
  background-color: var(--theme-tertiary);
  color: var(--theme-default);
}
.active {
  background: #e0e2e4;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.gender-img {
  width: 100%;
  text-align: center;
}
.gender-label {
  font-size: 1rem;
  font-weight: 400 !important;
  text-align: center;
}
.range {
  text-align: center;
}
.range-heading {
  margin-block: 30px;
  text-align: center;
}
.range-age {
  font-size: 1.2rem;
  font-weight: 500 !important;
  padding-block: 30px;
  text-align: center;
}
input[type="range"] {
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 15px;
  /*  overflow: hidden;  remove this line*/

  /* New additions */
  height: 6px;
  background: var(--theme-tertiary);
}

/* Thumb: webkit */
input[type="range"]::-webkit-slider-thumb {
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  height: 15px;
  width: 15px;
  background-color: var(--theme-default);
  border-radius: 50%;
  border: none;

  /* box-shadow: -407px 0 0 400px #f50; emove this line */
  transition: 0.2s ease-in-out;
}
input[type="range"]::-moz-range-thumb {
  height: 15px;
  width: 15px;
  background-color: var(--theme-default);
  border-radius: 50%;
  border: none;
  transition: 0.2s ease-in-out;
}
/* Hover, active & focus Thumb: Webkit */

input[type="range"]::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 10px rgba(var(--theme-default), 0.1);
}
input[type="range"]:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(var(--theme-default), 0.2);
}
input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 13px rgba(var(--theme-default), 0.2);
}
.range {
  margin: 0 auto;
  width: 80%;
  padding: 0px 10px;
}
.checkbox-wrapper {
  box-sizing: border-box;
  height: 20px;
  --background-color: #fff;
  --checkbox-height: 20px;
}
@-moz-keyframes dothabottomcheck {
  0% {
    height: 0;
  }
  100% {
    height: calc(var(--checkbox-height) / 2);
  }
}
@-webkit-keyframes dothabottomcheck {
  0% {
    height: 0;
  }
  100% {
    height: calc(var(--checkbox-height) / 2);
  }
}
@keyframes dothabottomcheck {
  0% {
    height: 0;
  }
  100% {
    height: calc(var(--checkbox-height) / 2);
  }
}
@keyframes dothatopcheck {
  0% {
    height: 0;
  }
  50% {
    height: 0;
  }
  100% {
    height: calc(var(--checkbox-height) * 1.2);
  }
}
@-webkit-keyframes dothatopcheck {
  0% {
    height: 0;
  }
  50% {
    height: 0;
  }
  100% {
    height: calc(var(--checkbox-height) * 1.2);
  }
}
@-moz-keyframes dothatopcheck {
  0% {
    height: 0;
  }
  50% {
    height: 0;
  }
  100% {
    height: calc(var(--checkbox-height) * 1.2);
  }
}
.checkbox-wrapper input[type="checkbox"] {
  display: none;
}
.checkbox-wrapper .check-box {
  height: var(--checkbox-height) !important;
  width: var(--checkbox-height) !important;
  background-color: transparent;
  border: calc(var(--checkbox-height) * 0.1) solid #1e445c;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -moz-transition: border-color ease 0.2s;
  -o-transition: border-color ease 0.2s;
  -webkit-transition: border-color ease 0.2s;
  transition: border-color ease 0.2s;
  cursor: pointer;
}
.checkbox-wrapper .check-box::before,
.checkbox-wrapper .check-box::after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  height: 0;
  width: calc(var(--checkbox-height) * 0.2);
  background-color: #34b93d;
  display: inline-block;
  -moz-transform-origin: left top;
  -ms-transform-origin: left top;
  -o-transform-origin: left top;
  -webkit-transform-origin: left top;
  transform-origin: left top;
  border-radius: 5px;
  content: " ";
  -webkit-transition: opacity ease 0.5;
  -moz-transition: opacity ease 0.5;
  transition: opacity ease 0.5;
}
.checkbox-wrapper .check-box::before {
  top: calc(var(--checkbox-height) * 0.72);
  left: calc(var(--checkbox-height) * 0.41);
  box-shadow: 0 0 0 calc(var(--checkbox-height) * 0.05) var(--background-color);
  -moz-transform: rotate(-135deg);
  -ms-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}
.checkbox-wrapper .check-box::after {
  top: calc(var(--checkbox-height) * 0.37);
  left: calc(var(--checkbox-height) * 0.05);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.checkbox-wrapper input[type="checkbox"]:checked + .check-box,
.checkbox-wrapper .check-box.checked {
  border-color: #34b93d;
}
.checkbox-wrapper input[type="checkbox"]:checked + .check-box::after,
.checkbox-wrapper .check-box.checked::after {
  height: calc(var(--checkbox-height) / 2);
  -moz-animation: dothabottomcheck 0.2s ease 0s forwards;
  -o-animation: dothabottomcheck 0.2s ease 0s forwards;
  -webkit-animation: dothabottomcheck 0.2s ease 0s forwards;
  animation: dothabottomcheck 0.2s ease 0s forwards;
}
.checkbox-wrapper input[type="checkbox"]:checked + .check-box::before,
.checkbox-wrapper .check-box.checked::before {
  height: calc(var(--checkbox-height) * 1.2);
  -moz-animation: dothatopcheck 0.4s ease 0s forwards;
  -o-animation: dothatopcheck 0.4s ease 0s forwards;
  -webkit-animation: dothatopcheck 0.4s ease 0s forwards;
  animation: dothatopcheck 0.4s ease 0s forwards;
}
.label-input {
  cursor: pointer;
  font-size: 1.2rem;
  margin-bottom: 10px;
  opacity: 0.7;
  font-size: 18px;
}
</style>