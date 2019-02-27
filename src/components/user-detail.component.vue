<template>
  <tr class="text-secondary text-left small">
    <td colspan="3" class="align-bottom">
      <h4>{{user.name.first | titlecase}}
      <img style="width:40px" src="../assets/male.png" v-if="user.gender==='male'">
      <img style="width:20px" src="../assets/female.png" v-if="user.gender==='female'">
      </h4>
      <div>
        <strong>Username:</strong> {{user.login.username}}
      </div>
      <div>
        <strong>Registered:</strong> {{user.registered.date | date}}
      </div>
      <div>
        <strong>Email:</strong> {{user.email}}
      </div>
    </td>
    <td class="align-bottom">
      <div>
        <strong>Address:</strong> {{user.location.street}}
      </div>
      <div>
        <strong>City:</strong> {{user.location.city}}
      </div>
      <div>
        <strong>Zip Code:</strong> {{user.location.postcode}}
      </div>
    </td>
    <td class="align-bottom">
      <div>
        <strong>Birthday:</strong> {{user.dob.date | date}}
      </div>
      <div>
        <strong>Phone:</strong> {{user.phone}}
      </div>
      <div>
        <strong>Cell:</strong> {{user.cell}}
      </div>
    </td>
    <td colspan="4" class="align-bottom text-center">
      <!--<img :alt="user.name.first" class="rounded-circle img-thumbnail"-->
      <!--:src="user.picture.large" style="width:40%;">-->
    </td>
  </tr>
</template>

<script>
  export default {
    name: 'user-detail',
    props: {
      user: {
        type: Object
      }
    },
    filters: {
      titlecase(value) {
        return value[0].toUpperCase() + value.slice(1);
      },
      date(value) {
        let date = new Date(Date.parse(value));

        function addZero(date) {
          return date < 10 ? `0${date}` : date;
        }

        return addZero(date.getDate()) + "/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();
      }
    },
  }
</script>

<style scoped>

</style>
