const getData = () => {
  axios.get(${apiUrl}/Course, { headers })
      .then((result) => {
          const userDetails = JSON.parse(localStorage.getItem('userDetails'));
          const userRole = userDetails.role;
          if (userRole !== 'Admin') {
              const userGroupId = userGroupData.length > 0 ? userGroupData[0].groupID : null;
              if (userGroupId && groupData) {
                  setUserGroupName(getGroupById(userGroupId));
              }
              const filteredData = result.data.filter(course => course.groupName === userGroupName);
              if (filteredData.length === 0) {
                  setTimeout(() => {
                      setDynamicText("no data");
                  }, 2000);
              }
              setData(filteredData);
          } else {
              setData(result.data);
              if (result.data.length === 0) {
                  setTimeout(() => {
                      setDynamicText("no data");
                  }, 2000);
              }
          }

          clear();
      })
      .catch((error) => {
          console.log(error);
      });
    };
const Home = require("./Home.jsx");
const browserHistory = useBasename(createHistory)({
  basename: "/slgeducationapp"
});

ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/" component={App}>
          <IndexRoute component={Home} />
      </Route>
  </Router>,
  document.getElementById("wrap")
);